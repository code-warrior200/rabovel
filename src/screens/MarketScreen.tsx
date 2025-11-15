/**
 * MarketScreen Component
 * 
 * Binance-inspired Market Layout:
 * - Clean header with search
 * - Market statistics overview
 * - Tab-based filters
 * - Table-like asset list with sortable columns
 * - Color-coded price changes
 * - Favorites functionality
 */

// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
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
import { Card } from '../components/Card';

// Utils & Types
import { formatCurrency, formatPercent, formatLargeNumber } from '../utils/formatters';
import { Asset } from '../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
type FilterType = 'all' | 'tokens' | 'stocks' | 'nigerian' | 'favorites';
type SortType = 'name' | 'price' | 'change' | 'volume' | 'marketCap';
type SortDirection = 'asc' | 'desc';

interface MarketStats {
  totalMarketCap: number;
  totalVolume24h: number;
  totalChange24h: number;
  totalAssets: number;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const DEFAULT_FILTER: FilterType = 'all';
const DEFAULT_SORT: SortType = 'marketCap';
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const MarketScreen: React.FC = () => {
  // --------------------------------------------------------------------------
  // Context & State
  // --------------------------------------------------------------------------
  const { theme, themeMode } = useTheme();
  const { assets } = useApp();
  const navigation = useNavigation();
  
  // Local State
  const [activeFilter, setActiveFilter] = useState<FilterType>(DEFAULT_FILTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>(DEFAULT_SORT);
  const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // --------------------------------------------------------------------------
  // Computed Values
  // --------------------------------------------------------------------------
  
  // Filter assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Filter by type
      if (activeFilter === 'tokens' && asset.type !== 'token') return false;
      if (activeFilter === 'stocks' && asset.type !== 'stock') return false;
      if (activeFilter === 'nigerian' && asset.type !== 'stock') return false;
      if (activeFilter === 'favorites' && !favorites.has(asset.id)) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          asset.name.toLowerCase().includes(query) ||
          asset.symbol.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [assets, activeFilter, searchQuery, favorites]);

  // Sort assets
  const sortedAssets = useMemo(() => {
    const sorted = [...filteredAssets];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change':
          comparison = a.changePercent24h - b.changePercent24h;
          break;
        case 'volume':
          comparison = (a.volume || 0) - (b.volume || 0);
          break;
        case 'marketCap':
          comparison = (a.marketCap || 0) - (b.marketCap || 0);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredAssets, sortBy, sortDirection]);

  // Calculate market statistics
  const marketStats: MarketStats = useMemo(() => {
    const totalMarketCap = filteredAssets.reduce((sum, asset) => sum + (asset.marketCap || 0), 0);
    const totalVolume24h = filteredAssets.reduce((sum, asset) => sum + (asset.volume || 0), 0);
    
    // Calculate weighted average change
    let totalChange = 0;
    let totalWeight = 0;
    filteredAssets.forEach(asset => {
      const weight = asset.marketCap || 0;
      totalChange += asset.changePercent24h * weight;
      totalWeight += weight;
    });
    const totalChange24h = totalWeight > 0 ? totalChange / totalWeight : 0;

    return {
      totalMarketCap,
      totalVolume24h,
      totalChange24h,
      totalAssets: filteredAssets.length,
    };
  }, [filteredAssets]);

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  const handleFilterPress = useCallback((filter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filter);
  }, []);

  const handleSortPress = useCallback((column: SortType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection(DEFAULT_SORT_DIRECTION);
    }
  }, [sortBy, sortDirection]);

  const handleFavoritePress = useCallback((assetId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(assetId)) {
        newFavorites.delete(assetId);
      } else {
        newFavorites.add(assetId);
      }
      return newFavorites;
    });
  }, []);

  const getSortIcon = (column: SortType) => {
    if (sortBy !== column) {
      return <Ionicons name="swap-vertical" size={14} color={theme.colors.text.tertiary} />;
    }
    return sortDirection === 'asc' 
      ? <Ionicons name="arrow-up" size={14} color={theme.colors.primary[400]} />
      : <Ionicons name="arrow-down" size={14} color={theme.colors.primary[400]} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background.primary,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    searchContainer: {
      marginBottom: theme.spacing.sm,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.border.dark,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
      paddingVertical: 0,
    },
    clearButton: {
      marginLeft: theme.spacing.xs,
      padding: 4,
    },
    // Market Stats
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    statsCard: {
      padding: 0,
      overflow: 'hidden',
    },
    statsGradient: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: theme.spacing.md,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.primary,
      opacity: 0.8,
      marginBottom: 4,
      fontWeight: theme.typography.fontWeight.medium,
    },
    statValue: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    statChange: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    positiveChange: {
      color: theme.colors.success.light,
    },
    negativeChange: {
      color: theme.colors.error.light,
    },
    // Tabs/Filters
    tabsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      padding: 3,
      gap: 3,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: theme.colors.background.primary,
    },
    tabText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    activeTabText: {
      color: theme.colors.text.primary,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    // Table Header
    tableHeaderContainer: {
      backgroundColor: theme.colors.background.secondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.dark,
    },
    tableHeaderScroll: {
      maxHeight: 50,
    },
    tableHeaderScrollContent: {
      minWidth: '100%',
    },
    tableHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      minWidth: '100%',
    },
    tableHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
    },
    tableHeaderCell: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerAsset: {
      width: 120,
      minWidth: 100,
    },
    headerPrice: {
      width: 90,
      alignItems: 'flex-end',
      minWidth: 70,
    },
    headerChange: {
      width: 70,
      alignItems: 'flex-end',
      minWidth: 65,
    },
    headerVolume: {
      width: 95,
      alignItems: 'flex-end',
      minWidth: 75,
    },
    headerMarketCap: {
      width: 100,
      alignItems: 'flex-end',
      minWidth: 80,
    },
    headerFavorite: {
      width: 36,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: theme.spacing.xs,
    },
    headerText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    // Asset Rows
    scrollView: {
      flex: 1,
    },
    content: {
      paddingBottom: theme.spacing.xl,
    },
    assetRowWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.dark,
    },
    assetRowScroll: {
      maxHeight: 64,
    },
    assetRowScrollContent: {
      minWidth: '100%',
    },
    assetRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 4,
      minHeight: 60,
      minWidth: '100%',
      gap: theme.spacing.xs / 2,
    },
    assetCell: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 120,
      minWidth: 100,
    },
    assetIconContainer: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary[500],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.xs,
    },
    assetIconText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.background.primary,
      letterSpacing: 0.5,
    },
    assetInfo: {
      flex: 1,
      minWidth: 0,
    },
    assetSymbol: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    assetName: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    },
    // Price Column
    priceCell: {
      width: 90,
      alignItems: 'flex-end',
      minWidth: 70,
      paddingRight: 2,
    },
    priceText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      textAlign: 'right',
    },
    // Change Column
    changeCell: {
      width: 70,
      alignItems: 'flex-end',
      minWidth: 65,
      paddingRight: 2,
    },
    changeText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      textAlign: 'right',
    },
    // Volume Column
    volumeCell: {
      width: 95,
      alignItems: 'flex-end',
      minWidth: 75,
      paddingRight: 2,
    },
    volumeText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
      textAlign: 'right',
    },
    // Market Cap Column
    marketCapCell: {
      width: 100,
      alignItems: 'flex-end',
      minWidth: 80,
      paddingRight: 2,
    },
    marketCapText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
      textAlign: 'right',
    },
    // Favorite Column
    favoriteCell: {
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 2,
    },
    favoriteButton: {
      padding: 6,
      borderRadius: theme.borderRadius.sm,
    },
    emptyContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
    },
    emptyIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Markets</Text>
            <Text style={styles.subtitle}>
              {sortedAssets.length} {sortedAssets.length === 1 ? 'asset' : 'assets'}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={theme.colors.text.tertiary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search markets..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Market Statistics */}
      {sortedAssets.length > 0 && (
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <LinearGradient
              colors={theme.colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statsGradient}
            >
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Market Cap</Text>
                  <Text style={styles.statValue}>
                    {formatLargeNumber(marketStats.totalMarketCap)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>24h Volume</Text>
                  <Text style={styles.statValue}>
                    {formatLargeNumber(marketStats.totalVolume24h)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>24h Change</Text>
                  <Text
                    style={[
                      styles.statValue,
                      marketStats.totalChange24h >= 0 ? styles.positiveChange : styles.negativeChange,
                    ]}
                  >
                    {formatPercent(marketStats.totalChange24h)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>
      )}

      {/* Tabs/Filters */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {[
            { key: 'all' as FilterType, label: 'All' },
            { key: 'tokens' as FilterType, label: 'Tokens' },
            { key: 'stocks' as FilterType, label: 'Stocks' },
            { key: 'nigerian' as FilterType, label: 'Nigerian' },
            { key: 'favorites' as FilterType, label: 'Favorites' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeFilter === tab.key && styles.activeTab]}
              onPress={() => handleFilterPress(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Table Header - Scrollable */}
      {sortedAssets.length > 0 && (
        <View style={styles.tableHeaderContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            scrollEventThrottle={16}
            contentContainerStyle={styles.tableHeaderScrollContent}
            style={styles.tableHeaderScroll}
          >
            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderRow}>
                <TouchableOpacity
                  style={[styles.tableHeaderCell, styles.headerAsset]}
                  onPress={() => handleSortPress('name')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.headerText}>Asset</Text>
                  {getSortIcon('name')}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tableHeaderCell, styles.headerPrice]}
                  onPress={() => handleSortPress('price')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.headerText}>Price</Text>
                  {getSortIcon('price')}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tableHeaderCell, styles.headerChange]}
                  onPress={() => handleSortPress('change')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.headerText}>24h</Text>
                  {getSortIcon('change')}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tableHeaderCell, styles.headerVolume]}
                  onPress={() => handleSortPress('volume')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.headerText}>Volume</Text>
                  {getSortIcon('volume')}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tableHeaderCell, styles.headerMarketCap]}
                  onPress={() => handleSortPress('marketCap')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.headerText}>Mkt Cap</Text>
                  {getSortIcon('marketCap')}
                </TouchableOpacity>
                <View style={styles.headerFavorite} />
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Asset List - Scrollable */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {sortedAssets.length > 0 ? (
          sortedAssets.map((asset) => {
            const isPositive = asset.changePercent24h >= 0;
            const isFavorite = favorites.has(asset.id);

            return (
              <View key={asset.id} style={styles.assetRowWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEventThrottle={16}
                  contentContainerStyle={styles.assetRowScrollContent}
                  style={styles.assetRowScroll}
                  nestedScrollEnabled={true}
                >
                  <TouchableOpacity
                    style={styles.assetRow}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      (navigation as any).navigate('AssetDetail', { asset });
                    }}
                  >
                    {/* Asset Column - Left Aligned */}
                    <View style={styles.assetCell}>
                      <View style={styles.assetIconContainer}>
                        <Text style={styles.assetIconText}>
                          {asset.symbol.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.assetInfo}>
                        <Text style={styles.assetSymbol} numberOfLines={1}>
                          {asset.symbol}
                        </Text>
                        <Text style={styles.assetName} numberOfLines={1} ellipsizeMode="tail">
                          {asset.name}
                        </Text>
                      </View>
                    </View>

                    {/* Price Column - Right Aligned */}
                    <View style={styles.priceCell}>
                      <Text style={styles.priceText} numberOfLines={1}>
                        {formatCurrency(asset.price)}
                      </Text>
                    </View>

                    {/* 24h Change Column - Right Aligned */}
                    <View style={styles.changeCell}>
                      <Text
                        style={[
                          styles.changeText,
                          isPositive ? styles.positiveChange : styles.negativeChange,
                        ]}
                        numberOfLines={1}
                      >
                        {formatPercent(asset.changePercent24h)}
                      </Text>
                    </View>

                    {/* Volume Column - Right Aligned */}
                    <View style={styles.volumeCell}>
                      <Text style={styles.volumeText} numberOfLines={1}>
                        {formatLargeNumber(asset.volume || 0)}
                      </Text>
                    </View>

                    {/* Market Cap Column - Right Aligned */}
                    <View style={styles.marketCapCell}>
                      <Text style={styles.marketCapText} numberOfLines={1}>
                        {formatLargeNumber(asset.marketCap || 0)}
                      </Text>
                    </View>

                    {/* Favorite Column - Centered */}
                    <TouchableOpacity
                      style={styles.favoriteCell}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleFavoritePress(asset.id);
                      }}
                      activeOpacity={0.6}
                    >
                      <View style={styles.favoriteButton}>
                        <Ionicons
                          name={isFavorite ? 'star' : 'star-outline'}
                          size={18}
                          color={isFavorite ? theme.colors.warning.light : theme.colors.text.tertiary}
                        />
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="search-outline"
                size={64}
                color={theme.colors.text.tertiary}
              />
            </View>
            <Text style={styles.emptyTitle}>No assets found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search or filters'
                : activeFilter === 'favorites'
                ? 'Add assets to favorites to see them here'
                : 'No assets match your current filters'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
