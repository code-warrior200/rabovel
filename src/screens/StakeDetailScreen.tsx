import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StakingPool } from '../types';

interface RouteParams {
  pool: StakingPool;
}

export const StakeDetailScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { addStake, walletBalance, updateWalletBalance, addNotification } = useApp();
  const route = useRoute();
  const navigation = useNavigation();
  const [stakeAmount, setStakeAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(false);

  // Get pool from route params or use default
  const routeParams = (route.params as RouteParams) || null;
  const pool = routeParams?.pool || {
    id: 'pool1',
    assetId: '1',
    asset: { symbol: 'NGN', name: 'Nigerian Naira Token' },
    apy: 12.5,
    minStake: 100,
    lockPeriod: 30,
    totalStaked: 0,
    totalRewards: 0,
    isActive: true,
  };

  const estimatedReward =
    parseFloat(stakeAmount || '0') * (pool.apy / 100) * (parseInt(lockPeriod || '30') / 365);

  const handleStake = async () => {
    // Validate inputs
    const amount = parseFloat(stakeAmount);
    const days = parseInt(lockPeriod);

    if (!stakeAmount || isNaN(amount) || amount <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Amount', 'Please enter a valid stake amount.');
      return;
    }

    if (amount < pool.minStake) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Minimum Stake Required',
        `The minimum stake amount is ${formatCurrency(pool.minStake)}.`
      );
      return;
    }

    if (amount > walletBalance) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Insufficient Balance',
        `You don't have enough balance. Your current balance is ${formatCurrency(walletBalance)}.`
      );
      return;
    }

    if (!lockPeriod || isNaN(days) || days <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Lock Period', 'Please enter a valid lock period in days.');
      return;
    }

    // Confirm staking
    Alert.alert(
      'Confirm Staking',
      `Are you sure you want to stake ${formatCurrency(amount)} for ${days} days?\n\nEstimated reward: ${formatCurrency(estimatedReward)}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsLoading(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            try {
              // Simulate API call delay
              await new Promise((resolve) => setTimeout(resolve, 1500));

              // Calculate dates
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + days);

              // Create stake object
              const newStake = {
                id: `stake_${Date.now()}`,
                poolId: pool.id,
                amount: amount,
                startDate: startDate,
                endDate: endDate,
                reward: estimatedReward,
                status: 'active' as const,
              };

              // Add stake to user stakes
              addStake(newStake);

              // Update wallet balance
              updateWalletBalance(walletBalance - amount);

              // Add success notification
              addNotification({
                title: 'Staking Successful',
                message: `You have successfully staked ${formatCurrency(amount)} for ${days} days. Estimated reward: ${formatCurrency(estimatedReward)}`,
                type: 'success',
                relatedAssetId: pool.assetId,
              });

              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

              // Show success alert
              Alert.alert(
                'Staking Successful!',
                `You have successfully staked ${formatCurrency(amount)} for ${days} days.\n\nEstimated reward: ${formatCurrency(estimatedReward)}\n\nYour stake will be locked until ${endDate.toLocaleDateString()}.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]
              );
            } catch (error) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to create stake. Please try again.';
              Alert.alert('Staking Failed', errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
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
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    assetInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary[500],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    iconText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    assetSymbol: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    assetName: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    apyContainer: {
      alignItems: 'flex-end',
    },
    apyBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    apyText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.background.primary,
    },
    formCard: {
      marginBottom: theme.spacing.md,
    },
    infoSection: {
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.dark,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    infoLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    infoValue: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
    },
    termsCard: {
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.info.dark + '20',
      borderColor: theme.colors.info.main,
      borderWidth: 1,
    },
    termsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    termsTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
      marginLeft: theme.spacing.sm,
    },
    termsText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.assetInfo}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>
                  {pool.asset.symbol.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.assetSymbol}>{pool.asset.symbol}</Text>
                <Text style={styles.assetName}>{pool.asset.name}</Text>
              </View>
            </View>
            <View style={styles.apyContainer}>
              <LinearGradient
                colors={theme.colors.gradient.secondary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.apyBadge}
              >
                <Text style={styles.apyText}>
                  {formatNumber(pool.apy)}% APY
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Staking Form */}
          <Card style={styles.formCard}>
            <Input
              label="Stake Amount"
              placeholder="Enter amount to stake"
              value={stakeAmount}
              onChangeText={setStakeAmount}
              keyboardType="numeric"
              leftIcon={
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              }
            />

            <Input
              label="Lock Period (days)"
              placeholder="Select lock period"
              value={lockPeriod}
              onChangeText={setLockPeriod}
              keyboardType="numeric"
              leftIcon={
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              }
            />

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Available Balance</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(walletBalance)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Min Stake</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(pool.minStake)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estimated Reward</Text>
                <Text style={[styles.infoValue, { color: theme.colors.success.main }]}>
                  {formatCurrency(estimatedReward || 0)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Terms */}
          <Card style={styles.termsCard}>
            <View style={styles.termsHeader}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.colors.info.main}
              />
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
            </View>
            <Text style={styles.termsText}>
              • Your assets will be locked for the selected period{'\n'}
              • Rewards are distributed automatically{'\n'}
              • Early withdrawal is not allowed{'\n'}
              • Minimum stake: {formatCurrency(pool.minStake)}
            </Text>
          </Card>

          <Button
            title={isLoading ? 'Processing...' : 'Stake Now'}
            onPress={handleStake}
            variant="primary"
            size="large"
            fullWidth
            disabled={
              isLoading ||
              !stakeAmount ||
              parseFloat(stakeAmount) < pool.minStake ||
              parseFloat(stakeAmount) > walletBalance
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
