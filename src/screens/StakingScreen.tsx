import React, { useState, useMemo } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { StakingPoolCard } from '../components/StakingPoolCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatPercent, formatNumber, formatLargeNumber } from '../utils/formatters';
import { StakingPool } from '../types';

export const StakingScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { stakingPools, userStakes } = useApp();
  const [activeTab, setActiveTab] = useState<'pools' | 'stakes'>('pools');
  const [sortBy, setSortBy] = useState<'apy' | 'totalStaked' | 'lockPeriod'>('apy');
  const navigation = useNavigation();

  // Calculate pool statistics
  const poolsStats = useMemo(() => {
    if (stakingPools.length === 0) {
      return {
        totalStaked: 0,
        highestAPY: 0,
        averageAPY: 0,
        totalPools: 0,
      };
    }

    const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.totalStaked, 0);
    const highestAPY = Math.max(...stakingPools.map((pool) => pool.apy));
    const averageAPY = stakingPools.reduce((sum, pool) => sum + pool.apy, 0) / stakingPools.length;

    return {
      totalStaked,
      highestAPY,
      averageAPY,
      totalPools: stakingPools.length,
    };
  }, [stakingPools]);

  // Sort pools based on selected criteria
  const sortedPools = useMemo(() => {
    const pools = [...stakingPools];
    switch (sortBy) {
      case 'apy':
        return pools.sort((a, b) => b.apy - a.apy);
      case 'totalStaked':
        return pools.sort((a, b) => b.totalStaked - a.totalStaked);
      case 'lockPeriod':
        return pools.sort((a, b) => a.lockPeriod - b.lockPeriod);
      default:
        return pools;
    }
  }, [stakingPools, sortBy]);

  const handlePoolPress = (pool: StakingPool) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (navigation as any).navigate('StakeDetail', { pool });
  };

  // Calculate total stats
  const totalStaked = userStakes.reduce((sum, stake) => sum + stake.amount, 0);
  const totalRewards = userStakes.reduce((sum, stake) => sum + stake.reward, 0);
  const activeStakesCount = userStakes.filter(
    (s) => s.status === 'active'
  ).length;

  const handleTabChange = (tab: 'pools' | 'stakes') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

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
    stakeDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 4,
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
              Earn rewards by staking your assets
            </Text>
          </View>
        </View>

        {/* Stats Summary - Show when viewing My Stakes */}
        {activeTab === 'stakes' && userStakes.length > 0 && (
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
                    <Text style={styles.statLabel}>Total Staked</Text>
                    <Text style={styles.statValue}>
                      {formatCurrency(totalStaked)}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Rewards</Text>
                    <Text style={styles.statValue}>
                      {formatCurrency(totalRewards)}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Active Stakes</Text>
                    <Text style={styles.statValue}>{activeStakesCount}</Text>
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
            {/* Info Card - Modern Design */}
            <Card style={styles.infoCard} variant="outlined">
              <LinearGradient
                colors={[theme.colors.info.dark + '15', theme.colors.info.dark + '05']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoGradient}
              >
                <View style={styles.infoHeader}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons
                      name="information-circle"
                      size={28}
                      color={theme.colors.info.main}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>How Staking Works</Text>
                    <Text style={styles.infoText}>
                      Lock your assets in staking pools to earn rewards. The
                      longer you stake, the higher the APY. Rewards are
                      distributed automatically.
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Card>

            {/* Staking Pools */}
            {stakingPools.length > 0 ? (
              <View style={styles.poolsContainer}>
                {/* Enhanced Section Header */}
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderTop}>
                    <View style={styles.sectionTitleContainer}>
                      <View style={styles.sectionIconContainer}>
                        <LinearGradient
                          colors={theme.colors.gradient.secondary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.sectionIconGradient}
                        >
                          <Ionicons
                            name="water"
                            size={20}
                            color={theme.colors.background.primary}
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.sectionTitleContent}>
                        <Text style={styles.sectionTitle}>Available Pools</Text>
                        <Text style={styles.sectionSubtitle}>
                          {stakingPools.length} pool{stakingPools.length !== 1 ? 's' : ''} available
                        </Text>
                      </View>
                    </View>
                    <View style={styles.poolCountBadge}>
                      <Text style={styles.poolCountText}>
                        {stakingPools.length}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Pool Statistics Cards */}
                <View style={styles.poolStatsContainer}>
                  <Card style={styles.poolStatCard} variant="elevated">
                    <View style={styles.poolStatContent}>
                      <View style={styles.poolStatIconContainer}>
                        <LinearGradient
                          colors={[theme.colors.success.main + '30', 'transparent']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.poolStatIconGradient}
                        >
                          <Ionicons
                            name="trending-up"
                            size={18}
                            color={theme.colors.success.main}
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.poolStatDetails}>
                        <Text style={styles.poolStatValue}>
                          {formatNumber(poolsStats.highestAPY)}%
                        </Text>
                        <Text style={styles.poolStatLabel}>Highest APY</Text>
                      </View>
                    </View>
                  </Card>

                  <Card style={styles.poolStatCard} variant="elevated">
                    <View style={styles.poolStatContent}>
                      <View style={styles.poolStatIconContainer}>
                        <LinearGradient
                          colors={[theme.colors.info.main + '30', 'transparent']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.poolStatIconGradient}
                        >
                          <Ionicons
                            name="stats-chart"
                            size={18}
                            color={theme.colors.info.main}
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.poolStatDetails}>
                        <Text style={styles.poolStatValue}>
                          {formatNumber(poolsStats.averageAPY)}%
                        </Text>
                        <Text style={styles.poolStatLabel}>Avg APY</Text>
                      </View>
                    </View>
                  </Card>

                  <Card style={styles.poolStatCard} variant="elevated">
                    <View style={styles.poolStatContent}>
                      <View style={styles.poolStatIconContainer}>
                        <LinearGradient
                          colors={[theme.colors.secondary[500] + '30', 'transparent']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.poolStatIconGradient}
                        >
                          <Ionicons
                            name="wallet"
                            size={18}
                            color={theme.colors.secondary[400]}
                          />
                        </LinearGradient>
                      </View>
                      <View style={styles.poolStatDetails}>
                        <Text style={styles.poolStatValue} numberOfLines={1}>
                          ₦{formatLargeNumber(poolsStats.totalStaked)}
                        </Text>
                        <Text style={styles.poolStatLabel}>Total Staked</Text>
                      </View>
                    </View>
                  </Card>
                </View>

                {/* Sort Options */}
                <View style={styles.sortContainer}>
                  <Text style={styles.sortLabel}>Sort by:</Text>
                  <View style={styles.sortButtons}>
                    <TouchableOpacity
                      style={[
                        styles.sortButton,
                        sortBy === 'apy' && styles.sortButtonActive,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSortBy('apy');
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="trending-up"
                        size={14}
                        color={
                          sortBy === 'apy'
                            ? theme.colors.text.primary
                            : theme.colors.text.secondary
                        }
                      />
                      <Text
                        style={[
                          styles.sortButtonText,
                          sortBy === 'apy' && styles.sortButtonTextActive,
                        ]}
                      >
                        APY
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.sortButton,
                        sortBy === 'totalStaked' && styles.sortButtonActive,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSortBy('totalStaked');
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="wallet-outline"
                        size={14}
                        color={
                          sortBy === 'totalStaked'
                            ? theme.colors.text.primary
                            : theme.colors.text.secondary
                        }
                      />
                      <Text
                        style={[
                          styles.sortButtonText,
                          sortBy === 'totalStaked' && styles.sortButtonTextActive,
                        ]}
                      >
                        Staked
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.sortButton,
                        sortBy === 'lockPeriod' && styles.sortButtonActive,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSortBy('lockPeriod');
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={
                          sortBy === 'lockPeriod'
                            ? theme.colors.text.primary
                            : theme.colors.text.secondary
                        }
                      />
                      <Text
                        style={[
                          styles.sortButtonText,
                          sortBy === 'lockPeriod' && styles.sortButtonTextActive,
                        ]}
                      >
                        Period
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Pool Cards */}
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
                              Asset
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
                            <View style={styles.stakeDetailRow}>
                              <Ionicons
                                name="trophy-outline"
                                size={16}
                                color={theme.colors.secondary[400]}
                              />
                              <Text style={styles.stakeDetailLabel}>
                                Total Rewards
                              </Text>
                            </View>
                            <Text style={styles.stakeDetailValue}>
                              {formatCurrency(stake.reward)}
                            </Text>
                          </View>
                          <View style={styles.stakeDetailItem}>
                            <View style={styles.stakeDetailRow}>
                              <Ionicons
                                name="calendar-outline"
                                size={16}
                                color={theme.colors.info.main}
                              />
                              <Text style={styles.stakeDetailLabel}>
                                End Date
                              </Text>
                            </View>
                            <Text style={styles.stakeDetailValue}>
                              {stake.endDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
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
                  Start staking your assets to earn passive rewards. Browse
                  available pools below.
                </Text>
                <Button
                  title="Browse Pools"
                  onPress={() => handleTabChange('pools')}
                  variant="primary"
                  size="medium"
                  style={styles.emptyButton}
                />
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
