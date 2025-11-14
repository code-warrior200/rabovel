import React, { useState, useMemo } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { AssetCard } from '../components/AssetCard';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatPercent } from '../utils/formatters';

type FilterType = 'all' | 'nigerian' | 'tokens' | 'stocks';
type SortType = 'name' | 'price' | 'change' | 'volume';

export const MarketScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { assets, marketData } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('name');

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter((asset) => {
      // Filter by type
      if (activeFilter === 'all') {
        // All assets match
      } else if (activeFilter === 'tokens') {
        if (asset.type !== 'token') return false;
      } else if (activeFilter === 'stocks') {
        if (asset.type !== 'stock') return false;
      } else if (activeFilter === 'nigerian') {
        if (asset.type !== 'stock') return false;
      }

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

    // Sort assets
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.changePercent24h - a.changePercent24h;
        case 'volume':
          return (b.marketCap || 0) - (a.marketCap || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [assets, activeFilter, searchQuery, sortBy]);

  const handleFilterPress = (filter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filter);
  };

  const handleSortPress = (sort: SortType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSortBy(sort);
  };

  const tokenCount = assets.filter((a) => a.type === 'token').length;
  const stockCount = assets.filter((a) => a.type === 'stock').length;
  const totalMarketCap = assets.reduce((sum, asset) => sum + (asset.marketCap || 0), 0);

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
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 4,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    sortButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.small,
    },
    searchContainer: {
      marginBottom: theme.spacing.sm,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      height: 48,
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
    filters: {
      marginBottom: theme.spacing.md,
    },
    filtersContent: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    filter: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.tertiary,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.dark,
    },
    activeFilter: {
      backgroundColor: theme.colors.primary[500],
      borderColor: theme.colors.primary[400],
      ...theme.shadows.small,
    },
    filterIcon: {
      marginRight: 6,
    },
    filterText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    activeFilterText: {
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
    overviewCard: {
      marginBottom: theme.spacing.md,
      padding: 0,
      overflow: 'hidden',
    },
    overviewGradient: {
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
    },
    overviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    overviewHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    overviewIconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    overviewTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    overviewSubtitle: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.primary,
      opacity: 0.8,
    },
    overviewStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    overviewStat: {
      alignItems: 'flex-end',
    },
    overviewStatDivider: {
      width: 1,
      height: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    overviewStatLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.primary,
      opacity: 0.8,
      marginBottom: 4,
    },
    overviewStatValue: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    sortIndicator: {
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
    },
    sortIndicatorText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    },
    sortIndicatorValue: {
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.semiBold,
    },
    emptyCard: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      minHeight: 300,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.regular,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Market</Text>
            <Text style={styles.subtitle}>Nigerian & African Markets</Text>
          </View>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              const sortOptions: SortType[] = ['name', 'price', 'change', 'volume'];
              const currentIndex = sortOptions.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              handleSortPress(sortOptions[nextIndex]);
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="swap-vertical-outline"
              size={20}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
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
              placeholder="Search assets..."
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
                  size={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {[
          { key: 'all' as FilterType, label: 'All', icon: 'grid-outline' },
          { key: 'tokens' as FilterType, label: 'Tokens', icon: 'logo-bitcoin' },
          { key: 'stocks' as FilterType, label: 'Stocks', icon: 'trending-up-outline' },
          { key: 'nigerian' as FilterType, label: 'Nigerian', icon: 'flag-outline' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filter,
              activeFilter === filter.key && styles.activeFilter,
            ]}
            onPress={() => handleFilterPress(filter.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={
                activeFilter === filter.key
                  ? theme.colors.text.primary
                  : theme.colors.text.secondary
              }
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Market Overview */}
        <Card style={styles.overviewCard}>
          <LinearGradient
            colors={theme.colors.gradient.primary as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.overviewGradient}
          >
            <View style={styles.overviewHeader}>
              <View style={styles.overviewHeaderLeft}>
                <View style={styles.overviewIconContainer}>
                  <Ionicons
                    name="stats-chart"
                    size={24}
                    color={theme.colors.text.primary}
                  />
                </View>
                <View>
                  <Text style={styles.overviewTitle}>Market Overview</Text>
                  <Text style={styles.overviewSubtitle}>
                    {filteredAndSortedAssets.length} {filteredAndSortedAssets.length === 1 ? 'asset' : 'assets'}
                  </Text>
                </View>
              </View>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatLabel}>Tokens</Text>
                  <Text style={styles.overviewStatValue}>{tokenCount}</Text>
                </View>
                <View style={styles.overviewStatDivider} />
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewStatLabel}>Stocks</Text>
                  <Text style={styles.overviewStatValue}>{stockCount}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Sort Indicator */}
        {filteredAndSortedAssets.length > 0 && (
          <View style={styles.sortIndicator}>
            <Text style={styles.sortIndicatorText}>
              Sorted by:{' '}
              <Text style={styles.sortIndicatorValue}>
                {sortBy === 'name' && 'Name'}
                {sortBy === 'price' && 'Price'}
                {sortBy === 'change' && '24h Change'}
                {sortBy === 'volume' && 'Market Cap'}
              </Text>
            </Text>
          </View>
        )}

        {/* Assets List */}
        {filteredAndSortedAssets.length > 0 ? (
          filteredAndSortedAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyIconContainer}>
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
                : 'No assets match your current filters'}
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
