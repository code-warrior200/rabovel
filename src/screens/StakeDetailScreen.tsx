import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const StakeDetailScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const [stakeAmount, setStakeAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('30');

  // Mock pool data
  const pool = {
    id: 'pool1',
    asset: { symbol: 'NGN', name: 'Nigerian Naira Token' },
    apy: 12.5,
    minStake: 100,
    lockPeriod: 30,
  };

  const estimatedReward =
    parseFloat(stakeAmount) * (pool.apy / 100) * (parseInt(lockPeriod) / 365);

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
                <Text style={styles.infoLabel}>Min Stake</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(pool.minStake)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estimated Reward</Text>
                <Text style={styles.infoValue}>
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
            title="Stake Now"
            onPress={() => {}}
            variant="primary"
            size="large"
            fullWidth
            disabled={!stakeAmount || parseFloat(stakeAmount) < pool.minStake}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
