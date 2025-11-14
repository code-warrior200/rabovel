import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StakingPool } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatNumber, formatLargeNumber } from '../utils/formatters';
import { Card } from './Card';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface StakingPoolCardProps {
  pool: StakingPool;
  onPress?: () => void;
}

export const StakingPoolCard: React.FC<StakingPoolCardProps> = ({
  pool,
  onPress,
}) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: theme.spacing.md,
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  iconText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  assetDetails: {
    flex: 1,
  },
  symbol: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  name: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  apySection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  apyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apyLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  apyIcon: {
    marginRight: theme.spacing.xs,
  },
  apyLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  apyBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    gap: 4,
    ...theme.shadows.small,
  },
  apyValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background.primary,
    lineHeight: 32,
  },
  apySuffix: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.background.primary,
    opacity: 0.9,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.dark,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: 4,
  },
  metricIconContainer: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stakedIconBg: {
    backgroundColor: theme.colors.primary[500] + '20',
  },
  minIconBg: {
    backgroundColor: theme.colors.info.main + '20',
  },
  periodIconBg: {
    backgroundColor: theme.colors.secondary[500] + '20',
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: theme.colors.border.dark,
    marginHorizontal: theme.spacing.sm,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.dark,
    gap: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  statusBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success.dark + '30',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.success.main + '40',
    ...theme.shadows.small,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success.light,
    marginRight: 4,
  },
    statusText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.success.light,
      fontWeight: theme.typography.fontWeight.bold,
      letterSpacing: 0.5,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardWrapper}>
      <Card style={styles.card} variant="elevated">
        {/* Active Status Badge */}
        {pool.isActive && (
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        )}

        {/* Header Section with Gradient Background */}
        <LinearGradient
          colors={[theme.colors.primary[500] + '15', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.assetInfo}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={theme.colors.gradient.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Text style={styles.iconText}>
                    {pool.asset.symbol.substring(0, 2).toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>
              <View style={styles.assetDetails}>
                <Text style={styles.symbol}>{pool.asset.symbol}</Text>
                <Text style={styles.name} numberOfLines={1}>
                  {pool.asset.name}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* APY Highlight Section */}
        <View style={styles.apySection}>
          <View style={styles.apyContent}>
            <View style={styles.apyLabelContainer}>
              <Ionicons
                name="trophy"
                size={16}
                color={theme.colors.secondary[400]}
                style={styles.apyIcon}
              />
              <Text style={styles.apyLabel}>Annual Yield</Text>
            </View>
            <LinearGradient
              colors={theme.colors.gradient.secondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.apyBadge}
            >
              <Text style={styles.apyValue}>{formatNumber(pool.apy)}%</Text>
              <Text style={styles.apySuffix}>APY</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconContainer, styles.stakedIconBg]}>
                <Ionicons
                  name="wallet-outline"
                  size={14}
                  color={theme.colors.primary[400]}
                />
              </View>
              <Text style={styles.metricLabel}>Total Staked</Text>
            </View>
            <Text style={styles.metricValue} numberOfLines={1}>
              ₦{formatLargeNumber(pool.totalStaked)}
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconContainer, styles.minIconBg]}>
                <Ionicons
                  name="arrow-down-circle-outline"
                  size={14}
                  color={theme.colors.info.main}
                />
              </View>
              <Text style={styles.metricLabel}>Min Stake</Text>
            </View>
            <Text style={styles.metricValue} numberOfLines={1}>
              {formatCurrency(pool.minStake)}
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconContainer, styles.periodIconBg]}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={theme.colors.secondary[400]}
                />
              </View>
              <Text style={styles.metricLabel}>Lock Period</Text>
            </View>
            <Text style={styles.metricValue}>
              {pool.lockPeriod} {pool.lockPeriod === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        {/* Action Indicator */}
        <View style={styles.actionIndicator}>
          <Text style={styles.actionText}>Tap to stake</Text>
          <Ionicons
            name="arrow-forward-circle"
            size={20}
            color={theme.colors.primary[400]}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
