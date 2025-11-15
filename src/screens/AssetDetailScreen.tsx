/**
 * AssetDetailScreen Component
 * 
 * Comprehensive asset details view:
 * - Asset header with price and change
 * - Price statistics (24h high/low, all-time high/low)
 * - Market data (volume, market cap, supply)
 * - Price change history (24h, 7d, 30d, all-time)
 * - Trading actions (Buy, Sell, Trade buttons)
 * - Asset information
 */

// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Context & Hooks
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

// Components
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Utils & Types
import { formatCurrency, formatPercent, formatLargeNumber } from '../utils/formatters';
import { Asset } from '../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
type AssetDetailRouteParams = {
  AssetDetail: {
    asset: Asset;
  };
};

type AssetDetailRouteProp = RouteProp<AssetDetailRouteParams, 'AssetDetail'>;

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const AssetDetailScreen: React.FC = () => {
  // --------------------------------------------------------------------------
  // Context & State
  // --------------------------------------------------------------------------
  const { theme, themeMode } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<AssetDetailRouteProp>();
  const { asset } = route.params;

  // --------------------------------------------------------------------------
  // Computed Values
  // --------------------------------------------------------------------------
  const isPositive = asset.changePercent24h >= 0;
  
  // Calculate extended statistics (simulated - in real app, fetch from API)
  const extendedStats = useMemo(() => {
    const price24hHigh = asset.price * (1 + Math.abs(asset.changePercent24h) / 100 + 0.05);
    const price24hLow = asset.price * (1 - Math.abs(asset.changePercent24h) / 100 - 0.05);
    const allTimeHigh = asset.price * 1.5;
    const allTimeLow = asset.price * 0.3;
    const circulatingSupply = asset.marketCap ? asset.marketCap / asset.price : 0;
    const maxSupply = circulatingSupply * 1.2;
    
    return {
      price24hHigh,
      price24hLow,
      allTimeHigh,
      allTimeLow,
      circulatingSupply,
      maxSupply,
      change7d: asset.changePercent24h * 1.2,
      change30d: asset.changePercent24h * 1.8,
    };
  }, [asset]);

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleTrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Create a basic option contract for trading
    const optionContract = {
      id: 'temp',
      assetId: asset.id,
      asset: asset,
      strikePrice: asset.price,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      type: 'call' as const,
      premium: asset.price * 0.1,
      openInterest: 0,
      volume: 0,
    };
    (navigation as any).navigate('TradingDetail', {
      option: {
        ...optionContract,
        expiryDate: optionContract.expiryDate.toISOString(),
      },
    });
  };

  const handleBuy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    (navigation as any).navigate('BuyAsset', { asset });
  };

  const handleSell = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    (navigation as any).navigate('SellAsset', { asset });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.dark,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      flex: 1,
    },
    headerSymbol: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    headerName: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingBottom: theme.spacing.xl,
    },
    // Price Section
    priceSection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    priceCard: {
      padding: 0,
      overflow: 'hidden',
    },
    priceGradient: {
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
    },
    currentPrice: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    priceChange: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    priceChangeText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    priceChangeLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.primary,
      opacity: 0.8,
    },
    // Stats Grid
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      minWidth: '47%',
      padding: theme.spacing.md,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    statValue: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    // Market Data Section
    section: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.dark,
    },
    infoLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    infoValue: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
      textAlign: 'right',
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    // Actions Section
    actionsSection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
    },
    // Asset Type Badge
    assetTypeBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary[500] + '20',
      alignSelf: 'flex-start',
    },
    assetTypeText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.primary[400],
      textTransform: 'uppercase',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerSymbol}>{asset.symbol}</Text>
          <Text style={styles.headerName} numberOfLines={1}>
            {asset.name}
          </Text>
        </View>
        <View style={styles.assetTypeBadge}>
          <Text style={styles.assetTypeText}>{asset.type}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Price Section */}
        <View style={styles.priceSection}>
          <Card style={styles.priceCard}>
            <LinearGradient
              colors={theme.colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.priceGradient}
            >
              <Text style={styles.currentPrice}>
                {formatCurrency(asset.price)}
              </Text>
              <View style={styles.priceChange}>
                <Ionicons
                  name={isPositive ? 'trending-up' : 'trending-down'}
                  size={20}
                  color={isPositive ? theme.colors.success.light : theme.colors.error.light}
                />
                <Text
                  style={[
                    styles.priceChangeText,
                    isPositive
                      ? { color: theme.colors.success.light }
                      : { color: theme.colors.error.light },
                  ]}
                >
                  {formatPercent(asset.changePercent24h)}
                </Text>
                <Text style={styles.priceChangeLabel}>
                  ({formatCurrency(asset.change24h)})
                </Text>
              </View>

              {/* Quick Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>24h High</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(extendedStats.price24hHigh)}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>24h Low</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(extendedStats.price24hLow)}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>All-Time High</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(extendedStats.allTimeHigh)}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>All-Time Low</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(extendedStats.allTimeLow)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* Market Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Data</Text>
          <Card variant="outlined">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Market Cap</Text>
              <Text style={styles.infoValue}>
                {formatLargeNumber(asset.marketCap || 0)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>24h Volume</Text>
              <Text style={styles.infoValue}>
                {formatLargeNumber(asset.volume || 0)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Circulating Supply</Text>
              <Text style={styles.infoValue}>
                {formatLargeNumber(extendedStats.circulatingSupply)}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Max Supply</Text>
              <Text style={styles.infoValue}>
                {formatLargeNumber(extendedStats.maxSupply)}
              </Text>
            </View>
          </Card>
        </View>

        {/* Price Performance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Performance</Text>
          <Card variant="outlined">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>24h Change</Text>
              <Text
                style={[
                  styles.infoValue,
                  isPositive
                    ? { color: theme.colors.success.light }
                    : { color: theme.colors.error.light },
                ]}
              >
                {formatPercent(asset.changePercent24h)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>7d Change</Text>
              <Text
                style={[
                  styles.infoValue,
                  extendedStats.change7d >= 0
                    ? { color: theme.colors.success.light }
                    : { color: theme.colors.error.light },
                ]}
              >
                {formatPercent(extendedStats.change7d)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>30d Change</Text>
              <Text
                style={[
                  styles.infoValue,
                  extendedStats.change30d >= 0
                    ? { color: theme.colors.success.light }
                    : { color: theme.colors.error.light },
                ]}
              >
                {formatPercent(extendedStats.change30d)}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Price Change (24h)</Text>
              <Text
                style={[
                  styles.infoValue,
                  isPositive
                    ? { color: theme.colors.success.light }
                    : { color: theme.colors.error.light },
                ]}
              >
                {formatCurrency(asset.change24h)}
              </Text>
            </View>
          </Card>
        </View>

        {/* Asset Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asset Information</Text>
          <Card variant="outlined">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Symbol</Text>
              <Text style={styles.infoValue}>{asset.symbol}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{asset.name}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>
                {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
              </Text>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <View style={styles.actionButtons}>
            <Button
              title="Buy"
              onPress={handleBuy}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
            <Button
              title="Sell"
              onPress={handleSell}
              variant="secondary"
              size="large"
              style={styles.actionButton}
            />
          </View>
          <Button
            title="Trade"
            onPress={handleTrade}
            variant="outline"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

