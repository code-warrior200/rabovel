import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { Stake } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ExpandedStakes {
  [key: string]: boolean;
}

export const PortfolioScreen: React.FC = () => {
  const { portfolio, userStakes } = useApp();
  const { theme, themeMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [expandedStakes, setExpandedStakes] = useState<ExpandedStakes>({});
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Fade in animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const totalStaked = userStakes.reduce(
    (sum, stake) => sum + stake.amount,
    0
  );
  const totalRewards = userStakes.reduce(
    (sum, stake) => sum + stake.reward,
    0
  );
  const availableBalance = (portfolio?.totalValue || 0) - totalStaked - totalRewards;

  const handleRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const toggleBalanceVisibility = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowBalance(!showBalance);
  }, [showBalance]);

  const toggleStakeExpansion = useCallback((stakeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedStakes((prev) => ({
      ...prev,
      [stakeId]: !prev[stakeId],
    }));
  }, []);

  const calculateStakeProgress = (stake: Stake) => {
    const now = new Date().getTime();
    const start = stake.startDate.getTime();
    const end = stake.endDate.getTime();
    const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
    return progress;
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const portfolioBreakdown = [
    {
      id: 'available',
      label: 'Available',
      value: availableBalance,
      icon: 'wallet-outline',
      color: theme.colors.primary[400],
      percentage: portfolio?.totalValue ? (availableBalance / portfolio.totalValue) * 100 : 0,
    },
    {
      id: 'staked',
      label: 'Staked',
      value: totalStaked,
      icon: 'lock-closed-outline',
      color: theme.colors.secondary[500],
      percentage: portfolio?.totalValue ? (totalStaked / portfolio.totalValue) * 100 : 0,
    },
    {
      id: 'rewards',
      label: 'Rewards',
      value: totalRewards,
      icon: 'trophy-outline',
      color: theme.colors.success.main,
      percentage: portfolio?.totalValue ? (totalRewards / portfolio.totalValue) * 100 : 0,
    },
  ];

  const isPositive = (portfolio?.totalChangePercent || 0) >= 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    animatedContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    portfolioCardWrapper: {
      marginBottom: theme.spacing.lg,
    },
    summaryCard: {
      marginBottom: 0,
      padding: 0,
      overflow: 'hidden',
    },
    summaryGradient: {
      padding: theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    summaryLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: '#FFFFFF',
      opacity: 0.9,
      fontWeight: theme.typography.fontWeight.medium,
    },
    trendIcon: {
      opacity: 0.8,
    },
    portfolioValueContainer: {
      marginBottom: theme.spacing.md,
    },
    summaryValue: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: '#FFFFFF',
    },
    summaryChange: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    changeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing.xs,
    },
    summaryChangeText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    summaryTimeText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    breakdownContainer: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.md,
    },
    breakdown: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
    },
    breakdownCardWrapper: {
      flex: 1,
      minWidth: (SCREEN_WIDTH - theme.spacing.md * 3) / 3,
    },
    breakdownCard: {
      padding: theme.spacing.md,
    },
    breakdownHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    breakdownTitle: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      flex: 1,
    },
    breakdownValue: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.sm,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    progressBar: {
      flex: 1,
      height: 4,
      borderRadius: theme.borderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.full,
    },
    progressText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      minWidth: 40,
      textAlign: 'right',
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    badgeText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
    },
    stakeCardWrapper: {
      marginBottom: theme.spacing.md,
    },
    stakeCard: {
      padding: theme.spacing.md,
    },
    stakeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    stakeHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
      gap: theme.spacing.sm,
    },
    stakeIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stakeInfo: {
      flex: 1,
    },
    stakeAmount: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: 4,
    },
    stakeSubtext: {
      fontSize: theme.typography.fontSize.xs,
    },
    stakeHeaderRight: {
      alignItems: 'flex-end',
      gap: theme.spacing.xs,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    expandIcon: {
      marginTop: theme.spacing.xs,
    },
    stakeProgressContainer: {
      marginTop: theme.spacing.sm,
    },
    stakeProgressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    progressLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    progressValue: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
    },
    stakeProgressBar: {
      height: 6,
      borderRadius: theme.borderRadius.full,
      overflow: 'hidden',
      marginBottom: theme.spacing.xs,
    },
    stakeProgressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.full,
    },
    daysRemaining: {
      fontSize: theme.typography.fontSize.xs,
    },
    stakeDetails: {
      marginTop: theme.spacing.md,
    },
    divider: {
      height: 1,
      marginBottom: theme.spacing.md,
    },
    stakeDetailsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    stakeDetailItem: {
      flex: 1,
      alignItems: 'flex-start',
    },
    detailIconContainer: {
      width: 28,
      height: 28,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },
    stakeDetailLabel: {
      fontSize: theme.typography.fontSize.xs,
      marginBottom: 4,
      fontWeight: theme.typography.fontWeight.medium,
    },
    stakeDetailValue: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: 2,
    },
    stakeDetailSubtext: {
      fontSize: theme.typography.fontSize.xs,
    },
    emptyCard: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      minHeight: 200,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semiBold,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: theme.typography.fontSize.sm,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Portfolio
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              Your investment overview
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.background.card }]}
            onPress={toggleBalanceVisibility}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showBalance ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary[400]}
              colors={[theme.colors.primary[400]]}
            />
          }
        >
          {/* Portfolio Hero Card */}
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={toggleBalanceVisibility}
            style={styles.portfolioCardWrapper}
          >
            <Card style={styles.summaryCard}>
              <LinearGradient
                colors={theme.colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.summaryGradient}
              >
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
                  <Ionicons
                    name={isPositive ? 'trending-up' : 'trending-down'}
                    size={20}
                    color={theme.colors.text.primary}
                    style={styles.trendIcon}
                  />
                </View>
                <View style={styles.portfolioValueContainer}>
                  {showBalance ? (
                    <Text style={styles.summaryValue}>
                      {formatCurrency(portfolio?.totalValue || 0)}
                    </Text>
                  ) : (
                    <Text style={styles.summaryValue}>••••••</Text>
                  )}
                </View>
                <View style={styles.summaryChange}>
                  <View
                    style={[
                      styles.changeBadge,
                      {
                        backgroundColor: isPositive
                          ? theme.colors.success.main + '20'
                          : theme.colors.error.main + '20',
                      },
                    ]}
                  >
                    <Ionicons
                      name={isPositive ? 'arrow-up' : 'arrow-down'}
                      size={14}
                      color={isPositive ? theme.colors.success.main : theme.colors.error.main}
                    />
                    <Text
                      style={[
                        styles.summaryChangeText,
                        {
                          color: isPositive
                            ? theme.colors.success.main
                            : theme.colors.error.main,
                        },
                      ]}
                    >
                      {formatPercent(portfolio?.totalChangePercent || 0)}
                    </Text>
                  </View>
                  <Text style={[styles.summaryTimeText, { color: theme.colors.text.primary, opacity: 0.7 }]}>
                    Last 24h
                  </Text>
                </View>
              </LinearGradient>
            </Card>
          </TouchableOpacity>

          {/* Portfolio Breakdown */}
          <View style={styles.breakdownContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Portfolio Breakdown
            </Text>
            <View style={styles.breakdown}>
              {portfolioBreakdown.map((item, index) => {
                const percentage = item.percentage;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={styles.breakdownCardWrapper}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Card style={StyleSheet.flatten([styles.breakdownCard, { backgroundColor: theme.colors.background.card }])}>
                      <View style={styles.breakdownHeader}>
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: item.color + '20' },
                          ]}
                        >
                          <Ionicons
                            name={item.icon as any}
                            size={20}
                            color={item.color}
                          />
                        </View>
                        <Text style={[styles.breakdownTitle, { color: theme.colors.text.secondary }]}>
                          {item.label}
                        </Text>
                      </View>
                      <Text style={[styles.breakdownValue, { color: theme.colors.text.primary }]}>
                        {showBalance ? formatCurrency(item.value) : '••••'}
                      </Text>
                      <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { backgroundColor: theme.colors.background.tertiary }]}>
                          <Animated.View
                            style={[
                              styles.progressFill,
                              {
                                width: `${percentage}%`,
                                backgroundColor: item.color,
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.progressText, { color: theme.colors.text.tertiary }]}>
                          {percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Active Stakes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Active Stakes
              </Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.primary[400] + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.primary[400] }]}>
                  {userStakes.length}
                </Text>
              </View>
            </View>

            {userStakes.length > 0 ? (
              userStakes.map((stake, index) => {
                const isExpanded = expandedStakes[stake.id];
                const progress = calculateStakeProgress(stake);
                const daysRemaining = getDaysRemaining(stake.endDate);
                const rewardRate = stake.amount > 0 ? (stake.reward / stake.amount) * 100 : 0;

                return (
                  <TouchableOpacity
                    key={stake.id}
                    activeOpacity={0.9}
                    onPress={() => toggleStakeExpansion(stake.id)}
                    style={styles.stakeCardWrapper}
                  >
                    <Card style={StyleSheet.flatten([styles.stakeCard, { backgroundColor: theme.colors.background.card }])}>
                      <View style={styles.stakeHeader}>
                        <View style={styles.stakeHeaderLeft}>
                          <View
                            style={[
                              styles.stakeIconContainer,
                              { backgroundColor: theme.colors.secondary[500] + '20' },
                            ]}
                          >
                            <Ionicons
                              name="lock-closed"
                              size={20}
                              color={theme.colors.secondary[500]}
                            />
                          </View>
                          <View style={styles.stakeInfo}>
                            <Text style={[styles.stakeAmount, { color: theme.colors.text.primary }]}>
                              {showBalance ? formatCurrency(stake.amount) : '••••'}
                            </Text>
                            <Text style={[styles.stakeSubtext, { color: theme.colors.text.tertiary }]}>
                              {formatDate(stake.startDate)} - {formatDate(stake.endDate)}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.stakeHeaderRight}>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  stake.status === 'active'
                                    ? theme.colors.success.main + '20'
                                    : theme.colors.background.tertiary,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                {
                                  color:
                                    stake.status === 'active'
                                      ? theme.colors.success.main
                                      : theme.colors.text.tertiary,
                                },
                              ]}
                            >
                              {stake.status.toUpperCase()}
                            </Text>
                          </View>
                          <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={theme.colors.text.tertiary}
                            style={styles.expandIcon}
                          />
                        </View>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.stakeProgressContainer}>
                        <View style={styles.stakeProgressHeader}>
                          <Text style={[styles.progressLabel, { color: theme.colors.text.secondary }]}>
                            Progress
                          </Text>
                          <Text style={[styles.progressValue, { color: theme.colors.text.primary }]}>
                            {progress.toFixed(1)}%
                          </Text>
                        </View>
                        <View style={[styles.stakeProgressBar, { backgroundColor: theme.colors.background.tertiary }]}>
                          <Animated.View
                            style={[
                              styles.stakeProgressFill,
                              {
                                width: `${progress}%`,
                                backgroundColor: theme.colors.secondary[500],
                              },
                            ]}
                          />
                        </View>
                        <Text style={[styles.daysRemaining, { color: theme.colors.text.tertiary }]}>
                          {daysRemaining} days remaining
                        </Text>
                      </View>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <Animated.View style={styles.stakeDetails}>
                          <View style={[styles.divider, { backgroundColor: theme.colors.border.dark }]} />
                          <View style={styles.stakeDetailsGrid}>
                            <View style={styles.stakeDetailItem}>
                              <View style={styles.detailIconContainer}>
                                <Ionicons
                                  name="gift-outline"
                                  size={16}
                                  color={theme.colors.secondary[500]}
                                />
                              </View>
                              <Text style={[styles.stakeDetailLabel, { color: theme.colors.text.tertiary }]}>
                                Reward
                              </Text>
                              <Text style={[styles.stakeDetailValue, { color: theme.colors.text.primary }]}>
                                {showBalance ? formatCurrency(stake.reward) : '••••'}
                              </Text>
                              <Text style={[styles.stakeDetailSubtext, { color: theme.colors.text.tertiary }]}>
                                {rewardRate.toFixed(2)}% APY
                              </Text>
                            </View>
                            <View style={styles.stakeDetailItem}>
                              <View style={styles.detailIconContainer}>
                                <Ionicons
                                  name="calendar-outline"
                                  size={16}
                                  color={theme.colors.primary[400]}
                                />
                              </View>
                              <Text style={[styles.stakeDetailLabel, { color: theme.colors.text.tertiary }]}>
                                Start Date
                              </Text>
                              <Text style={[styles.stakeDetailValue, { color: theme.colors.text.primary }]}>
                                {formatDate(stake.startDate)}
                              </Text>
                            </View>
                            <View style={styles.stakeDetailItem}>
                              <View style={styles.detailIconContainer}>
                                <Ionicons
                                  name="time-outline"
                                  size={16}
                                  color={theme.colors.info.main}
                                />
                              </View>
                              <Text style={[styles.stakeDetailLabel, { color: theme.colors.text.tertiary }]}>
                                End Date
                              </Text>
                              <Text style={[styles.stakeDetailValue, { color: theme.colors.text.primary }]}>
                                {formatDate(stake.endDate)}
                              </Text>
                            </View>
                          </View>
                        </Animated.View>
                      )}
                    </Card>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Card style={StyleSheet.flatten([styles.emptyCard, { backgroundColor: theme.colors.background.card }])}>
                <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.background.tertiary }]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={48}
                    color={theme.colors.text.tertiary}
                  />
                </View>
                <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                  No active stakes
                </Text>
                <Text style={[styles.emptySubtext, { color: theme.colors.text.tertiary }]}>
                  Start staking to see your portfolio here
                </Text>
              </Card>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
