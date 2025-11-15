import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Card } from '../components/Card';
import { AssetCard } from '../components/AssetCard';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { portfolio, walletBalance, assets, stakingPools, userStakes, unreadCount } = useApp();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  const handleNotificationPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (navigation as any).navigate('Notifications');
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (navigation as any).navigate('Profile');
  };

  const handleRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleBalanceVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowBalance(!showBalance);
  };

  const quickActions = [
    {
      id: 'stake',
      title: 'Stake',
      icon: 'lock-closed-outline',
      color: theme.colors.primary[400],
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        (navigation as any).navigate('MainTabs', { screen: 'Staking' });
      },
    },
    {
      id: 'trade',
      title: 'Trade',
      icon: 'swap-horizontal-outline',
      color: theme.colors.secondary[400],
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        (navigation as any).navigate('MainTabs', { screen: 'Trading' });
      },
    },
    {
      id: 'deposit',
      title: 'Deposit',
      icon: 'add-circle-outline',
      color: theme.colors.success.main,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        (navigation as any).navigate('Deposit');
      },
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: 'remove-circle-outline',
      color: theme.colors.info.main,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        (navigation as any).navigate('Withdraw');
      },
    },
  ];

  const statsCards = [
    {
      id: 'totalStaked',
      label: 'Total Staked',
      value: userStakes.reduce((sum, stake) => sum + stake.amount, 0),
      icon: 'lock-closed',
      color: theme.colors.primary[400],
    },
    {
      id: 'totalRewards',
      label: 'Total Rewards',
      value: userStakes.reduce((sum, stake) => sum + stake.reward, 0),
      icon: 'gift',
      color: theme.colors.secondary[400],
    },
    {
      id: 'activeStakes',
      label: 'Active Stakes',
      value: userStakes.filter((s) => s.status === 'active').length,
      icon: 'trending-up',
      color: theme.colors.success.main,
    },
  ];

  const isPositive = (portfolio?.totalChangePercent || 0) >= 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
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
          {/* Modern Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View>
                <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>
                  {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
                </Text>
                <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
                  {user?.name || 'Investor'}
                </Text>
              </View>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: theme.colors.background.card }]}
                onPress={handleNotificationPress}
                activeOpacity={0.7}
              >
                <View style={styles.notificationContainer}>
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={theme.colors.text.primary}
                  />
                  {unreadCount > 0 && (
                    <View style={[styles.notificationBadge, { backgroundColor: theme.colors.error.main }]}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: theme.colors.background.card }]}
                onPress={handleProfilePress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Portfolio Hero Card */}
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={toggleBalanceVisibility}
            style={styles.portfolioCardWrapper}
          >
            <Card style={styles.portfolioCard}>
              <LinearGradient
                colors={theme.colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.portfolioGradient}
              >
                <View style={styles.portfolioHeader}>
                  <View>
                    <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
                    <View style={styles.portfolioValueContainer}>
                      {showBalance ? (
                        <Text style={styles.portfolioValue}>
                          {formatCurrency(portfolio?.totalValue || 0)}
                        </Text>
                      ) : (
                        <Text style={styles.portfolioValue}>••••••</Text>
                      )}
                      <TouchableOpacity
                        onPress={toggleBalanceVisibility}
                        style={styles.eyeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name={showBalance ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color={theme.colors.text.primary}
                          style={{ opacity: 0.8 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.portfolioChange}>
                  <View
                    style={[
                      styles.changeBadge,
                      {
                        backgroundColor: isPositive
                          ? `${theme.colors.success.main}25`
                          : `${theme.colors.error.main}25`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isPositive ? 'trending-up' : 'trending-down'}
                      size={16}
                      color={isPositive ? theme.colors.success.light : theme.colors.error.light}
                    />
                    <Text
                      style={[
                        styles.portfolioChangeText,
                        {
                          color: isPositive
                            ? theme.colors.success.light
                            : theme.colors.error.light,
                        },
                      ]}
                    >
                      {formatPercent(portfolio?.totalChangePercent || 0)}
                    </Text>
                    <Text style={[styles.portfolioChangeLabel, { opacity: 0.7 }]}>24h</Text>
                  </View>
                </View>
              </LinearGradient>
            </Card>
          </TouchableOpacity>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {statsCards.map((stat, index) => (
              <TouchableOpacity
                key={stat.id}
                activeOpacity={0.8}
                style={styles.statCard}
              >
                <Card style={StyleSheet.flatten([styles.statCardInner, { backgroundColor: theme.colors.background.card }])}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}20` }]}>
                    <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                  </View>
                  <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                    {stat.id === 'activeStakes'
                      ? stat.value
                      : formatCurrency(stat.value)}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                    {stat.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wallet Balance Card */}
          <Card style={StyleSheet.flatten([styles.walletCard, { backgroundColor: theme.colors.background.card }])}>
            <View style={styles.walletHeader}>
              <View style={styles.walletInfo}>
                <View style={[styles.walletIconContainer, { backgroundColor: `${theme.colors.secondary[400]}20` }]}>
                  <Ionicons
                    name="wallet-outline"
                    size={24}
                    color={theme.colors.secondary[400]}
                  />
                </View>
                <View>
                  <Text style={[styles.walletLabel, { color: theme.colors.text.secondary }]}>
                    Available Balance
                  </Text>
                  <Text style={[styles.walletValue, { color: theme.colors.text.primary }]}>
                    {showBalance ? formatCurrency(walletBalance) : '••••••'}
                  </Text>
                </View>
              </View>
              <View style={styles.walletActions}>
                <TouchableOpacity
                  style={[styles.walletActionButton, { backgroundColor: `${theme.colors.primary[400]}20` }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    (navigation as any).navigate('Deposit');
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={theme.colors.primary[400]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.walletActionButton, { backgroundColor: `${theme.colors.secondary[400]}20` }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    (navigation as any).navigate('Withdraw');
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-up" size={20} color={theme.colors.secondary[400]} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Quick Actions
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsContainer}
            >
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  onPress={action.onPress}
                  activeOpacity={0.8}
                  style={styles.quickActionButton}
                >
                  <LinearGradient
                    colors={[`${action.color}15`, `${action.color}05`]}
                    style={styles.quickActionGradient}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}25` }]}>
                      <Ionicons name={action.icon as any} size={28} color={action.color} />
                    </View>
                    <Text style={[styles.quickActionText, { color: theme.colors.text.primary }]}>
                      {action.title}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Active Stakes Section */}
          {stakingPools.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                  Active Staking Pools
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    (navigation as any).navigate('MainTabs', { screen: 'Staking' });
                  }}
                >
                  <Text style={[styles.seeAllText, { color: theme.colors.primary[400] }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              {stakingPools.slice(0, 2).map((pool) => (
                <AssetCard
                  key={pool.id}
                  asset={pool.asset}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    (navigation as any).navigate('AssetDetail', { asset: pool.asset });
                  }}
                />
              ))}
            </View>
          )}

          {/* Top Assets Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Top Assets
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  (navigation as any).navigate('MainTabs', { screen: 'Market' });
                }}
              >
                <Text style={[styles.seeAllText, { color: theme.colors.primary[400] }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            {assets.slice(0, 3).map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  (navigation as any).navigate('AssetDetail', { asset });
                }}
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#0A0E27',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  portfolioCardWrapper: {
    marginBottom: 20,
  },
  portfolioCard: {
    padding: 0,
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
  },
  portfolioGradient: {
    padding: 24,
    borderRadius: 24,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  portfolioHeader: {
    marginBottom: 16,
  },
  portfolioLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '500',
  },
  portfolioValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  portfolioValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  eyeButton: {
    padding: 4,
  },
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  portfolioChangeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  portfolioChangeLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
  },
  statCardInner: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  walletCard: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  walletValue: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 8,
  },
  walletActionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsContainer: {
    paddingRight: 20,
    gap: 12,
  },
  quickActionButton: {
    width: 100,
    marginRight: 12,
  },
  quickActionGradient: {
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
