/**
 * BuyAssetScreen Component
 * 
 * Buy asset functionality:
 * - Asset information display
 * - Quantity input
 * - Price calculation
 * - Total cost display
 * - Payment method selection
 * - Order confirmation
 */

// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Context & Hooks
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';

// Components
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

// Utils & Types
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Asset } from '../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
type BuyAssetRouteParams = {
  BuyAsset: {
    asset: Asset;
  };
};

type BuyAssetRouteProp = RouteProp<BuyAssetRouteParams, 'BuyAsset'>;

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const BuyAssetScreen: React.FC = () => {
  // --------------------------------------------------------------------------
  // Context & State
  // --------------------------------------------------------------------------
  const { theme, themeMode } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<BuyAssetRouteProp>();
  const { asset } = route.params;
  const { walletBalance, updateWalletBalance } = useApp();
  const { currency } = useSettings();
  
  const [quantity, setQuantity] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // --------------------------------------------------------------------------
  // Computed Values
  // --------------------------------------------------------------------------
  const quantityNum = parseFloat(quantity) || 0;
  const totalCost = quantityNum * asset.price;
  const hasSufficientBalance = totalCost <= walletBalance;
  const canBuy = quantityNum > 0 && hasSufficientBalance && !isProcessing;

  // Quick amounts (percentages of wallet balance)
  const quickAmounts = useMemo(() => {
    const balance = walletBalance || 1000;
    return [
      balance * 0.25,
      balance * 0.5,
      balance * 0.75,
      balance,
    ].map(val => (val / asset.price).toFixed(asset.price > 1 ? 2 : 4));
  }, [walletBalance, asset.price]);

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleQuickAmount = (qty: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity(qty);
  };

  const handleBuy = async () => {
    if (!canBuy) {
      if (quantityNum <= 0) {
        Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      } else if (!hasSufficientBalance) {
        Alert.alert('Insufficient Balance', 'You do not have sufficient balance to complete this purchase.');
      }
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);

    // Simulate buy order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update wallet balance (simulated)
    const newBalance = walletBalance - totalCost;
    updateWalletBalance(newBalance);

    setIsProcessing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Purchase Successful',
      `You have successfully purchased ${formatNumber(quantityNum)} ${asset.symbol} for ${formatCurrency(totalCost, currency)}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleMax = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const maxQuantity = walletBalance / asset.price;
    setQuantity(maxQuantity.toFixed(asset.price > 1 ? 2 : 4));
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
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
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
    // Asset Info Card
    assetCard: {
      marginBottom: theme.spacing.lg,
      padding: 0,
      overflow: 'hidden',
    },
    assetGradient: {
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
    },
    assetInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    assetIcon: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    assetIconText: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    assetDetails: {
      flex: 1,
    },
    assetSymbol: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    currentPrice: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
      opacity: 0.9,
    },
    // Balance Card
    balanceCard: {
      marginBottom: theme.spacing.lg,
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    balanceValue: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    // Input Section
    inputSection: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    inputRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    inputContainer: {
      flex: 1,
    },
    maxButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.dark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    maxButtonText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.primary[400],
    },
    // Quick Amounts
    quickAmountsContainer: {
      marginBottom: theme.spacing.lg,
    },
    quickAmountsLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    quickAmountsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    quickAmountButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: theme.colors.border.dark,
      alignItems: 'center',
    },
    quickAmountText: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    },
    // Summary Card
    summaryCard: {
      marginBottom: theme.spacing.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.dark,
    },
    summaryLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    summaryValue: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
    },
    totalRow: {
      borderBottomWidth: 0,
      marginTop: theme.spacing.xs,
      paddingTop: theme.spacing.md,
    },
    totalLabel: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    totalValue: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.success.light,
    },
    errorText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error.light,
      marginTop: theme.spacing.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
    // Action Button
    actionButton: {
      marginTop: theme.spacing.md,
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
          <Text style={styles.headerSymbol}>Buy {asset.symbol}</Text>
          <Text style={styles.headerName}>{asset.name}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Asset Info */}
          <Card style={styles.assetCard}>
            <LinearGradient
              colors={theme.colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.assetGradient}
            >
              <View style={styles.assetInfo}>
                <View style={styles.assetIcon}>
                  <Text style={styles.assetIconText}>
                    {asset.symbol.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.assetDetails}>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                  <Text style={styles.currentPrice}>
                    {formatCurrency(asset.price, currency)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Card>

          {/* Balance */}
          <Card style={styles.balanceCard} variant="outlined">
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>
                {formatCurrency(walletBalance, currency)}
              </Text>
            </View>
          </Card>

          {/* Quantity Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="0.00"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="decimal-pad"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={styles.maxButton}
                onPress={handleMax}
                activeOpacity={0.7}
              >
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
            </View>
            {quantityNum > 0 && !hasSufficientBalance && (
              <Text style={styles.errorText}>
                Insufficient balance
              </Text>
            )}
          </View>

          {/* Quick Amounts */}
          <View style={styles.quickAmountsContainer}>
            <Text style={styles.quickAmountsLabel}>Quick Select</Text>
            <View style={styles.quickAmountsRow}>
              {quickAmounts.map((qty, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickAmountButton}
                  onPress={() => handleQuickAmount(qty)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickAmountText}>
                    {['25%', '50%', '75%', '100%'][index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          {quantityNum > 0 && (
            <Card style={styles.summaryCard} variant="outlined">
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price per {asset.symbol}</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(asset.price, currency)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Quantity</Text>
                <Text style={styles.summaryValue}>
                  {formatNumber(quantityNum)} {asset.symbol}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(totalCost, currency)}
                </Text>
              </View>
            </Card>
          )}

          {/* Buy Button */}
          <Button
            title={isProcessing ? 'Processing...' : 'Buy'}
            onPress={handleBuy}
            variant="primary"
            size="large"
            disabled={!canBuy || isProcessing}
            style={styles.actionButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

