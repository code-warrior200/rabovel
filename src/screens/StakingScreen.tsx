/**
 * StakingScreen Component
 * 
 * Infrastructure Blueprint Pattern:
 * - Modular architecture with clear separation of concerns
 * - Custom hooks for data management and calculations
 * - Optimized performance with memoization
 * - Type-safe implementation
 * - Reusable utility functions
 */

// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Context & Hooks
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

// Components
import { StakingPoolCard } from '../components/StakingPoolCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Utils & Types
import { formatCurrency } from '../utils/formatters';
import { StakingPool, Stake } from '../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
type TabType = 'pools' | 'stakes';
type SortCriteria = 'apy' | 'totalStaked' | 'lockPeriod';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
}

interface PoolsStatistics {
  totalStaked: number;
  highestAPY: number;
  averageAPY: number;
  totalPools: number;
}

interface UserStakingStats {
  totalStaked: number;
  totalRewards: number;
  activeStakesCount: number;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const TIME_UPDATE_INTERVAL = 60000; // 1 minute in milliseconds
const DEFAULT_TAB: TabType = 'pools';
const DEFAULT_SORT: SortCriteria = 'apy';

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook for managing real-time clock updates
 */
const useRealtimeClock = (intervalMs: number = TIME_UPDATE_INTERVAL) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return currentTime;
};

/**
 * Hook for calculating pool statistics
 */
const usePoolsStatistics = (pools: StakingPool[]): PoolsStatistics => {
  return useMemo(() => {
    if (pools.length === 0) {
      return {
        totalStaked: 0,
        highestAPY: 0,
        averageAPY: 0,
        totalPools: 0,
      };
    }

    const totalStaked = pools.reduce((sum, pool) => sum + pool.totalStaked, 0);
    const highestAPY = Math.max(...pools.map((pool) => pool.apy));
    const averageAPY = pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length;

    return {
      totalStaked,
      highestAPY,
      averageAPY,
      totalPools: pools.length,
    };
  }, [pools]);
};

/**
 * Hook for calculating user staking statistics
 */
const useUserStakingStats = (stakes: Stake[]): UserStakingStats => {
  return useMemo(() => {
    const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0);
    const totalRewards = stakes.reduce((sum, stake) => sum + stake.reward, 0);
    const activeStakesCount = stakes.filter((s) => s.status === 'active').length;

    return {
      totalStaked,
      totalRewards,
      activeStakesCount,
    };
  }, [stakes]);
};

/**
 * Hook for sorting pools based on criteria
 */
const useSortedPools = (pools: StakingPool[], sortBy: SortCriteria) => {
  return useMemo(() => {
    const sorted = [...pools];
    
    switch (sortBy) {
      case 'apy':
        return sorted.sort((a, b) => b.apy - a.apy);
      case 'totalStaked':
        return sorted.sort((a, b) => b.totalStaked - a.totalStaked);
      case 'lockPeriod':
        return sorted.sort((a, b) => a.lockPeriod - b.lockPeriod);
      default:
        return sorted;
    }
  }, [pools, sortBy]);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate time remaining until a date
 */
const calculateTimeRemaining = (endDate: Date, currentTime: Date): TimeRemaining => {
  const end = new Date(endDate);
  const diff = end.getTime() - currentTime.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isExpired: false };
};

/**
 * Format time remaining as a human-readable string
 */
const formatTimeRemainingText = (timeRemaining: TimeRemaining): string => {
  const { days, hours, minutes, isExpired } = timeRemaining;
  
  if (isExpired) {
    return 'Unlocked';
  }
  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
};

/**
 * Find pool associated with a stake
 */
const findPoolForStake = (stake: Stake, pools: StakingPool[]): StakingPool | undefined => {
  return pools.find(pool => pool.id === stake.poolId);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const StakingScreen: React.FC = () => {
  // --------------------------------------------------------------------------
  // Context & State
  // --------------------------------------------------------------------------
  const { theme, themeMode } = useTheme();
  const { stakingPools, userStakes } = useApp();
  const navigation = useNavigation();
  
  // Local State
  const initialTab: TabType = userStakes.length > 0 ? 'stakes' : DEFAULT_TAB;
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [sortBy, setSortBy] = useState<SortCriteria>(DEFAULT_SORT);

  // --------------------------------------------------------------------------
  // Custom Hooks
  // --------------------------------------------------------------------------
  const currentTime = useRealtimeClock(TIME_UPDATE_INTERVAL);
  const poolsStats = usePoolsStatistics(stakingPools);
  const userStats = useUserStakingStats(userStakes);
  const sortedPools = useSortedPools(stakingPools, sortBy);

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  const handleTabChange = useCallback((tab: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  }, []);

  const handlePoolPress = useCallback((pool: StakingPool) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (navigation as any).navigate('StakeDetail', { pool });
  }, [navigation]);

  // --------------------------------------------------------------------------
  // Computed Values
  // --------------------------------------------------------------------------
  const getTimeRemaining = useCallback((endDate: Date): TimeRemaining => {
    return calculateTimeRemaining(endDate, currentTime);
  }, [currentTime]);

  const formatTimeRemaining = useCallback((stake: Stake): string => {
    const timeRemaining = calculateTimeRemaining(stake.endDate, currentTime);
    return formatTimeRemainingText(timeRemaining);
  }, [currentTime]);

  const getPoolForStake = useCallback((stake: Stake): StakingPool | undefined => {
    return findPoolForStake(stake, stakingPools);
  }, [stakingPools]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 4,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.secondary,
      marginTop: 4,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    statsCard: {
      padding: 0,
      overflow: 'hidden',
    },
    statsGradient: {
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    simpleInfoContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    simpleInfoText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    simpleSectionHeader: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    simpleSectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    simpleSectionSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: theme.colors.text.primary + '20',
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.primary,
      opacity: 0.8,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    statValue: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    tabContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      padding: 4,
      gap: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    tabActive: {
      backgroundColor: 'transparent',
    },
    tabContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      position: 'relative',
      zIndex: 1,
    },
    tabText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    activeTabText: {
      color: theme.colors.text.primary,
      fontWeight: theme.typography.fontWeight.bold,
    },
    tabBadge: {
      backgroundColor: theme.colors.secondary[400],
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
    },
    tabBadgeText: {
      fontSize: 10,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.background.primary,
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    sectionHeaderTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    sectionIconContainer: {
      marginRight: theme.spacing.md,
    },
    sectionIconGradient: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.small,
    },
    sectionTitleContent: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
      letterSpacing: -0.3,
    },
    sectionSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    poolCountBadge: {
      backgroundColor: theme.colors.primary[500] + '20',
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      minWidth: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    poolCountText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary[400],
    },
    poolsContainer: {
      paddingTop: theme.spacing.sm,
    },
    poolStatsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    poolStatCard: {
      flex: 1,
      padding: theme.spacing.sm,
    },
    poolStatContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    poolStatIconContainer: {
      marginRight: theme.spacing.sm,
    },
    poolStatIconGradient: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    poolStatDetails: {
      flex: 1,
    },
    poolStatValue: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    poolStatLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sortLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    sortButtons: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.tertiary,
      gap: 4,
    },
    sortButtonActive: {
      backgroundColor: theme.colors.primary[500],
      ...theme.shadows.small,
    },
    sortButtonText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    sortButtonTextActive: {
      color: theme.colors.text.primary,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    poolsList: {
      paddingHorizontal: theme.spacing.md,
    },
    infoCard: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      padding: 0,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.info.main + '30',
    },
    infoGradient: {
      padding: theme.spacing.lg,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    infoIconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.info.main + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    infoText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    emptyCard: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      minHeight: 300,
      marginHorizontal: theme.spacing.md,
    },
    emptyIconContainer: {
      marginBottom: theme.spacing.lg,
    },
    emptyIconGradient: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    emptyButton: {
      marginTop: theme.spacing.md,
      minWidth: 160,
    },
    stakesContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    stakeCard: {
      marginBottom: theme.spacing.md,
      padding: 0,
      overflow: 'hidden',
    },
    stakeCardHeader: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
    },
    stakeCardIconContainer: {
      marginRight: theme.spacing.md,
    },
    stakeIconGradient: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stakeCardInfo: {
      flex: 1,
    },
    stakeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    stakeAmount: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    stakeAsset: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.tertiary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.tertiary,
      gap: theme.spacing.xs,
    },
    activeBadge: {
      backgroundColor: theme.colors.success.dark + '25',
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.text.tertiary,
    },
    activeDot: {
      backgroundColor: theme.colors.success.light,
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.tertiary,
      letterSpacing: 0.5,
    },
    activeText: {
      color: theme.colors.success.light,
    },
    stakeDetails: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.dark,
    },
    stakeDetailItem: {
      flex: 1,
    },
    stakeDetailLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    stakeDetailValue: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    unlockedText: {
      color: theme.colors.success.light,
    },
    stakePoolInfo: {
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.dark,
    },
    stakePoolInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    stakePoolInfoText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    quickActionHint: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    quickActionCard: {
      padding: 0,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.primary[500] + '30',
    },
    quickActionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.primary[500] + '10',
    },
    quickActionText: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    quickActionTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    quickActionSubtitle: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      lineHeight: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Staking</Text>
            <Text style={styles.subtitle}>
              Earn rewards on your assets
            </Text>
          </View>
        </View>

        {/* Simple Stats Summary - Only show if user has stakes */}
        {userStakes.length > 0 && (
          <View style={styles.statsContainer}>
            <Card style={styles.statsCard}>
              <LinearGradient
                colors={theme.colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statsGradient}
              >
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>You've Staked</Text>
                    <Text style={styles.statValue}>
                      {formatCurrency(userStats.totalStaked)}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Earned</Text>
                    <Text style={styles.statValue}>
                      {formatCurrency(userStats.totalRewards)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Card>
          </View>
        )}

        {/* Modern Segmented Control Tabs */}
        <View style={styles.tabContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pools' && styles.tabActive]}
              onPress={() => handleTabChange('pools')}
              activeOpacity={0.7}
            >
              {activeTab === 'pools' && (
                <LinearGradient
                  colors={theme.colors.gradient.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: theme.borderRadius.lg }]}
                />
              )}
              <View style={styles.tabContent}>
                <Ionicons
                  name="layers-outline"
                  size={18}
                  color={
                    activeTab === 'pools'
                      ? theme.colors.text.primary
                      : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'pools' && styles.activeTabText,
                  ]}
                >
                  Pools
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'stakes' && styles.tabActive]}
              onPress={() => handleTabChange('stakes')}
              activeOpacity={0.7}
            >
              {activeTab === 'stakes' && (
                <LinearGradient
                  colors={theme.colors.gradient.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: theme.borderRadius.lg }]}
                />
              )}
              <View style={styles.tabContent}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={
                    activeTab === 'stakes'
                      ? theme.colors.text.primary
                      : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'stakes' && styles.activeTabText,
                  ]}
                >
                  My Stakes
                </Text>
                {userStakes.length > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{userStakes.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'pools' ? (
          <>
            {/* Simple Info - Only show if no stakes */}
            {userStakes.length === 0 && (
              <View style={styles.simpleInfoContainer}>
                <Text style={styles.simpleInfoText}>
                  Choose a pool below to start earning rewards. Tap any pool to stake.
                </Text>
              </View>
            )}

            {/* Staking Pools - Simplified */}
            {stakingPools.length > 0 ? (
              <View style={styles.poolsContainer}>
                {/* Simple Header */}
                <View style={styles.simpleSectionHeader}>
                  <Text style={styles.simpleSectionTitle}>
                    Staking Pools ({stakingPools.length})
                  </Text>
                  <Text style={styles.simpleSectionSubtitle}>
                    Showing best rates first
                  </Text>
                </View>

                {/* Pool Cards - Already sorted by APY */}
                <View style={styles.poolsList}>
                  {sortedPools.map((pool) => (
                    <StakingPoolCard
                      key={pool.id}
                      pool={pool}
                      onPress={() => handlePoolPress(pool)}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <Card style={styles.emptyCard} variant="outlined">
                <View style={styles.emptyIconContainer}>
                  <Ionicons
                    name="layers-outline"
                    size={64}
                    color={theme.colors.text.tertiary}
                  />
                </View>
                <Text style={styles.emptyTitle}>
                  No Staking Pools Available
                </Text>
                <Text style={styles.emptyText}>
                  New staking pools will appear here when they become available
                </Text>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* My Stakes */}
            {userStakes.length > 0 ? (
              <View style={styles.stakesContainer}>
                {/* Simple Header */}
                <View style={styles.simpleSectionHeader}>
                  <Text style={styles.simpleSectionTitle}>
                    Your Stakes ({userStakes.length})
                  </Text>
                  {userStats.activeStakesCount > 0 && (
                    <Text style={styles.simpleSectionSubtitle}>
                      {userStats.activeStakesCount} active
                    </Text>
                  )}
                </View>
                {userStakes.map((stake, index) => (
                  <Card key={stake.id} style={styles.stakeCard} variant="outlined">
                    <View style={styles.stakeCardHeader}>
                      <View style={styles.stakeCardIconContainer}>
                        <LinearGradient
                          colors={theme.colors.gradient.secondary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.stakeIconGradient}
                        >
                          <Ionicons
                            name="lock-closed"
                            size={24}
                            color={theme.colors.background.primary}
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.stakeCardInfo}>
                        <View style={styles.stakeHeader}>
                          <View>
                            <Text style={styles.stakeAmount}>
                              {formatCurrency(stake.amount)}
                            </Text>
                            <Text style={styles.stakeAsset}>
                              {getPoolForStake(stake)?.asset.symbol || 'Asset'}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.statusBadge,
                              stake.status === 'active' && styles.activeBadge,
                            ]}
                          >
                            <View
                              style={[
                                styles.statusDot,
                                stake.status === 'active' && styles.activeDot,
                              ]}
                            />
                            <Text
                              style={[
                                styles.statusText,
                                stake.status === 'active' && styles.activeText,
                              ]}
                            >
                              {stake.status.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.stakeDetails}>
                          <View style={styles.stakeDetailItem}>
                            <Text style={styles.stakeDetailLabel}>
                              Rewards Earned
                            </Text>
                            <Text style={styles.stakeDetailValue}>
                              {formatCurrency(stake.reward)}
                            </Text>
                          </View>
                          <View style={styles.stakeDetailItem}>
                            <Text style={styles.stakeDetailLabel}>
                              {getTimeRemaining(stake.endDate).isExpired ? 'Status' : 'Unlocks In'}
                            </Text>
                            <Text style={[
                              styles.stakeDetailValue,
                              getTimeRemaining(stake.endDate).isExpired && styles.unlockedText
                            ]}>
                              {formatTimeRemaining(stake)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            ) : (
              <Card style={styles.emptyCard} variant="outlined">
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={[theme.colors.primary[400] + '20', theme.colors.primary[600] + '10']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={64}
                      color={theme.colors.primary[400]}
                    />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyTitle}>No Active Stakes</Text>
                <Text style={styles.emptyText}>
                  {stakingPools.length > 0 
                    ? 'Start earning rewards by staking your assets. Choose a pool to begin.'
                    : 'No pools available right now. Check back later.'}
                </Text>
                {stakingPools.length > 0 && (
                  <Button
                    title="View Pools"
                    onPress={() => handleTabChange('pools')}
                    variant="primary"
                    size="medium"
                    style={styles.emptyButton}
                  />
                )}
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
