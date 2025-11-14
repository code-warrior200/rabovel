import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AssetCard } from '../components/AssetCard';
import { Ionicons } from '@expo/vector-icons';
import { OptionContract } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const TradingScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { assets, options } = useApp();
  const [activeTab, setActiveTab] = useState<'options' | 'spot'>('options');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Calculate statistics for options
  const optionsStats = useMemo(() => {
    if (options.length === 0) {
      return {
        avgPremium: 0,
        callOptions: 0,
        putOptions: 0,
        totalVolume: 0,
      };
    }

    const totalPremium = options.reduce((sum, opt) => sum + opt.premium, 0);
    const avgPremium = totalPremium / options.length;
    const callOptions = options.filter((opt) => opt.type === 'call').length;
    const putOptions = options.filter((opt) => opt.type === 'put').length;
    const totalVolume = options.reduce((sum, opt) => sum + opt.volume, 0);

    return { avgPremium, callOptions, putOptions, totalVolume };
  }, [options]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 1500);
  }, []);

  const handleTabChange = (tab: 'options' | 'spot') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handleTradeOption = (option: OptionContract) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Convert Date to ISO string for serialization
    const serializedOption = {
      ...option,
      expiryDate: option.expiryDate.toISOString(),
    };
    (navigation as any).navigate('TradingDetail', { option: serializedOption });
  };

  const getDaysToExpiry = (expiryDate: Date) => {
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      marginTop: 10,
      paddingTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerTextContainer: {
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    headerActionButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 4,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    headerIconContainer: {
      marginTop: 0,
    },
    headerIconGradient: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.small,
    },
    tabsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.xl,
      padding: 4,
      gap: 4,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: 'transparent',
    },
    activeTab: {
      backgroundColor: theme.colors.primary[500],
      ...theme.shadows.small,
    },
    tabIcon: {
      marginRight: 6,
    },
    tabText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    activeTabText: {
      color: theme.colors.text.primary,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      flex: 1,
      padding: theme.spacing.sm,
    },
    statContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statIconContainer: {
      marginRight: theme.spacing.sm,
    },
    statIconGradient: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statDetails: {
      flex: 1,
    },
    statValue: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    },
    infoCard: {
      marginBottom: theme.spacing.lg,
      overflow: 'hidden',
    },
    infoGradient: {
      borderRadius: theme.borderRadius.xl,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    infoIconContainer: {
      marginRight: theme.spacing.md,
    },
    infoIconGradient: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.small,
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
    optionCardWrapper: {
      marginBottom: theme.spacing.md,
    },
    optionCard: {
      overflow: 'hidden',
    },
    optionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.lg,
    },
    optionAssetInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionAssetIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary[500] + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    optionAssetIconText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary[400],
    },
    optionSymbol: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    optionTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionTypeIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    callIndicator: {
      backgroundColor: theme.colors.success.main,
    },
    putIndicator: {
      backgroundColor: theme.colors.error.main,
    },
    optionType: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    optionPriceContainer: {
      alignItems: 'flex-end',
    },
    optionPriceLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
      marginBottom: 4,
    },
    optionPriceValue: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    optionMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.dark,
    },
    optionMetricItem: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    optionMetricLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    optionMetricValue: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    optionMetricDivider: {
      width: 1,
      backgroundColor: theme.colors.border.dark,
      marginHorizontal: theme.spacing.xs,
    },
    expiryBadgeContainer: {
      marginBottom: theme.spacing.md,
    },
    expiryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 6,
      borderRadius: theme.borderRadius.full,
    },
    expiryBadgeNormal: {
      backgroundColor: theme.colors.info.dark + '20',
    },
    expiryBadgeWarning: {
      backgroundColor: theme.colors.warning.dark + '20',
    },
    expiryBadgeUrgent: {
      backgroundColor: theme.colors.error.dark + '20',
    },
    expiryBadgeIcon: {
      marginRight: 4,
    },
    expiryBadgeText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    optionButton: {
      marginTop: theme.spacing.xs,
    },
    emptyCard: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      minHeight: 280,
      overflow: 'hidden',
    },
    emptyIconContainer: {
      marginBottom: theme.spacing.md,
    },
    emptyIconGradient: {
      width: 96,
      height: 96,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    emptySubtext: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Trading</Text>
            <Text style={styles.subtitle}>
              Trade options and spot markets
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerActionButton}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons
                name="search-outline"
                size={22}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={theme.colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerIconGradient}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={22}
                  color={theme.colors.text.primary}
                />
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>

      {/* Modern Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'options' && styles.activeTab]}
            onPress={() => handleTabChange('options')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="stats-chart"
              size={18}
              color={
                activeTab === 'options'
                  ? theme.colors.text.primary
                  : theme.colors.text.secondary
              }
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'options' && styles.activeTabText,
              ]}
            >
              Options
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'spot' && styles.activeTab]}
            onPress={() => handleTabChange('spot')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="flash"
              size={18}
              color={
                activeTab === 'spot'
                  ? theme.colors.text.primary
                  : theme.colors.text.secondary
              }
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'spot' && styles.activeTabText,
              ]}
            >
              Spot
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary[400]}
            colors={[theme.colors.primary[400]]}
          />
        }
      >
        {activeTab === 'options' ? (
          <>
            {/* Statistics Cards */}
            {options.length > 0 && (
              <View style={styles.statsContainer}>
                <Card style={styles.statCard} variant="elevated">
                  <View style={styles.statContent}>
                    <View style={styles.statIconContainer}>
                      <LinearGradient
                        colors={[theme.colors.info.main + '30', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIconGradient}
                      >
                        <Ionicons
                          name="stats-chart"
                          size={20}
                          color={theme.colors.info.main}
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.statDetails}>
                      <Text style={styles.statValue}>
                        {formatCurrency(optionsStats.avgPremium)}
                      </Text>
                      <Text style={styles.statLabel}>Avg Premium</Text>
                    </View>
                  </View>
                </Card>

                <Card style={styles.statCard} variant="elevated">
                  <View style={styles.statContent}>
                    <View style={styles.statIconContainer}>
                      <LinearGradient
                        colors={[theme.colors.success.main + '30', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIconGradient}
                      >
                        <Ionicons
                          name="trending-up"
                          size={20}
                          color={theme.colors.success.main}
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.statDetails}>
                      <Text style={styles.statValue}>
                        {optionsStats.callOptions}
                      </Text>
                      <Text style={styles.statLabel}>Call Options</Text>
                    </View>
                  </View>
                </Card>

                <Card style={styles.statCard} variant="elevated">
                  <View style={styles.statContent}>
                    <View style={styles.statIconContainer}>
                      <LinearGradient
                        colors={[theme.colors.error.main + '30', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statIconGradient}
                      >
                        <Ionicons
                          name="trending-down"
                          size={20}
                          color={theme.colors.error.main}
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.statDetails}>
                      <Text style={styles.statValue}>
                        {optionsStats.putOptions}
                      </Text>
                      <Text style={styles.statLabel}>Put Options</Text>
                    </View>
                  </View>
                </Card>
              </View>
            )}

            {/* Enhanced Info Card */}
            <Card style={styles.infoCard} variant="outlined">
              <LinearGradient
                colors={[theme.colors.info.dark + '30', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoGradient}
              >
                <View style={styles.infoHeader}>
                  <View style={styles.infoIconContainer}>
                    <LinearGradient
                      colors={[theme.colors.info.main, theme.colors.info.light]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.infoIconGradient}
                    >
                      <Ionicons
                        name="stats-chart"
                        size={24}
                        color={theme.colors.text.primary}
                      />
                    </LinearGradient>
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>Options Trading</Text>
                    <Text style={styles.infoText}>
                      Trade call and put options on tokens and stocks. Options
                      give you the right to buy or sell assets at a specified
                      price.
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Card>

            {/* Enhanced Options Contracts */}
            {options.length > 0 ? (
              options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.9}
                  style={styles.optionCardWrapper}
                >
                  <Card style={styles.optionCard} variant="elevated">
                    <View style={styles.optionHeader}>
                      <View style={styles.optionAssetInfo}>
                        <View style={styles.optionAssetIcon}>
                          <Text style={styles.optionAssetIconText}>
                            {option.asset.symbol.substring(0, 2).toUpperCase()}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.optionSymbol}>
                            {option.asset.symbol}
                          </Text>
                          <View style={styles.optionTypeBadge}>
                            <View
                              style={[
                                styles.optionTypeIndicator,
                                option.type === 'call'
                                  ? styles.callIndicator
                                  : styles.putIndicator,
                              ]}
                            />
                            <Text style={styles.optionType}>
                              {option.type.toUpperCase()} Option
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.optionPriceContainer}>
                        <Text style={styles.optionPriceLabel}>Premium</Text>
                        <Text style={styles.optionPriceValue}>
                          {formatCurrency(option.premium)}
                        </Text>
                      </View>
                    </View>

                    {/* Option Metrics Row */}
                    <View style={styles.optionMetrics}>
                      <View style={styles.optionMetricItem}>
                        <Ionicons
                          name="trending-up"
                          size={16}
                          color={theme.colors.text.tertiary}
                        />
                        <Text style={styles.optionMetricLabel}>Strike</Text>
                        <Text style={styles.optionMetricValue}>
                          {formatCurrency(option.strikePrice)}
                        </Text>
                      </View>
                      <View style={styles.optionMetricDivider} />
                      <View style={styles.optionMetricItem}>
                        <Ionicons
                          name="calendar"
                          size={16}
                          color={theme.colors.text.tertiary}
                        />
                        <Text style={styles.optionMetricLabel}>Expiry</Text>
                        <Text style={styles.optionMetricValue} numberOfLines={1}>
                          {option.expiryDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                      <View style={styles.optionMetricDivider} />
                      <View style={styles.optionMetricItem}>
                        <Ionicons
                          name="bar-chart"
                          size={16}
                          color={theme.colors.text.tertiary}
                        />
                        <Text style={styles.optionMetricLabel}>Volume</Text>
                        <Text style={styles.optionMetricValue}>
                          {formatNumber(option.volume)}
                        </Text>
                      </View>
                    </View>

                    {/* Days to Expiry Badge */}
                    <View style={styles.expiryBadgeContainer}>
                      <View
                        style={[
                          styles.expiryBadge,
                          (() => {
                            const daysToExpiry = getDaysToExpiry(
                              option.expiryDate
                            );
                            if (daysToExpiry <= 7)
                              return styles.expiryBadgeUrgent;
                            if (daysToExpiry <= 30)
                              return styles.expiryBadgeWarning;
                            return styles.expiryBadgeNormal;
                          })(),
                        ]}
                      >
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={theme.colors.text.primary}
                          style={styles.expiryBadgeIcon}
                        />
                        <Text style={styles.expiryBadgeText}>
                          {getDaysToExpiry(option.expiryDate)} days left
                        </Text>
                      </View>
                    </View>

                    <Button
                      title="Trade Now"
                      onPress={() => handleTradeOption(option)}
                      variant="primary"
                      size="medium"
                      style={styles.optionButton}
                    />
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <Card style={styles.emptyCard} variant="outlined">
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={[
                      theme.colors.info.dark + '30',
                      theme.colors.info.main + '10',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons
                      name="stats-chart-outline"
                      size={48}
                      color={theme.colors.info.main}
                    />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyText}>No options available</Text>
                <Text style={styles.emptySubtext}>
                  Options contracts will appear here when available
                </Text>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Enhanced Spot Trading */}
            <Card style={styles.infoCard} variant="outlined">
              <LinearGradient
                colors={[theme.colors.secondary[600] + '30', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoGradient}
              >
                <View style={styles.infoHeader}>
                  <View style={styles.infoIconContainer}>
                    <LinearGradient
                      colors={[
                        theme.colors.secondary[500],
                        theme.colors.secondary[400],
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.infoIconGradient}
                    >
                      <Ionicons
                        name="flash"
                        size={24}
                        color={theme.colors.background.primary}
                      />
                    </LinearGradient>
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>Spot Trading</Text>
                    <Text style={styles.infoText}>
                      Trade tokens and stocks instantly at current market
                      prices. Fast execution with real-time pricing.
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Card>

            {assets.length > 0 ? (
              assets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))
            ) : (
              <Card style={styles.emptyCard} variant="outlined">
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={[
                      theme.colors.secondary[600] + '30',
                      theme.colors.secondary[500] + '10',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons
                      name="flash-outline"
                      size={48}
                      color={theme.colors.secondary[400]}
                    />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyText}>No assets available</Text>
                <Text style={styles.emptySubtext}>
                  Assets will appear here when available
                </Text>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
