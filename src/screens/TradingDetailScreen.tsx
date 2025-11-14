import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { formatCurrency } from '../utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { OptionContract } from '../types';

interface RouteParams {
  option: Omit<OptionContract, 'expiryDate'> & { expiryDate: string };
}

export const TradingDetailScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const routeParams = (route.params as RouteParams) || {
    option: {
      id: '1',
      assetId: '1',
      asset: { symbol: 'DANGOTE', name: 'Dangote Cement' } as any,
      type: 'call' as const,
      strikePrice: 300,
      premium: 5.5,
      expiryDate: new Date('2024-12-31').toISOString(),
      openInterest: 0,
      volume: 0,
    },
  };

  // Convert ISO string back to Date object
  const option: OptionContract = {
    ...routeParams.option,
    expiryDate: new Date(routeParams.option.expiryDate),
  };

  const [quantity, setQuantity] = useState('');
  const [strikePrice, setStrikePrice] = useState(option.strikePrice.toString());

  useEffect(() => {
    setStrikePrice(option.strikePrice.toString());
  }, [option]);

  const totalCost = parseFloat(quantity) * option.premium || 0;

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
      marginRight: theme.spacing.md,
      padding: theme.spacing.xs,
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
    typeBadgeContainer: {
      marginBottom: theme.spacing.lg,
    },
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    callBadge: {
      backgroundColor: theme.colors.success.dark + '20',
    },
    putBadge: {
      backgroundColor: theme.colors.error.dark + '20',
    },
    typeIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },
    callIndicator: {
      backgroundColor: theme.colors.success.main,
    },
    putIndicator: {
      backgroundColor: theme.colors.error.main,
    },
    typeBadgeText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
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
    totalRow: {
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.medium,
    },
    totalLabel: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    totalValue: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary[400],
    },
    infoCard: {
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.info.dark + '20',
      borderColor: theme.colors.info.main,
      borderWidth: 1,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    infoTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
      marginLeft: theme.spacing.sm,
    },
    infoText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
  });

  const handleTrade = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Trade Placed',
      `Successfully placed order for ${quantity} ${option.type.toUpperCase()} option(s) of ${option.asset.symbol} at ${formatCurrency(totalCost)}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
            <View style={styles.assetInfo}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>
                  {option.asset.symbol.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.assetSymbol}>{option.asset.symbol}</Text>
                <Text style={styles.assetName}>{option.asset.name}</Text>
              </View>
            </View>
          </View>

          {/* Option Type Badge */}
          <View style={styles.typeBadgeContainer}>
            <View
              style={[
                styles.typeBadge,
                option.type === 'call'
                  ? styles.callBadge
                  : styles.putBadge,
              ]}
            >
              <View
                style={[
                  styles.typeIndicator,
                  option.type === 'call'
                    ? styles.callIndicator
                    : styles.putIndicator,
                ]}
              />
              <Text style={styles.typeBadgeText}>
                {option.type.toUpperCase()} Option
              </Text>
            </View>
          </View>

          {/* Trading Form */}
          <Card style={styles.formCard}>
            <Input
              label="Strike Price"
              placeholder="Enter strike price"
              value={strikePrice}
              onChangeText={setStrikePrice}
              keyboardType="numeric"
              leftIcon={
                <Ionicons
                  name="pricetag-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              }
            />

            <Input
              label="Quantity"
              placeholder="Enter quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              leftIcon={
                <Ionicons
                  name="layers-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              }
            />

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Premium per Contract</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(option.premium)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current Strike Price</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(option.strikePrice)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Expiry Date</Text>
                <Text style={styles.infoValue}>
                  {option.expiryDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Volume</Text>
                <Text style={styles.infoValue}>{option.volume}</Text>
              </View>
              <View style={[styles.infoRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Cost</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(totalCost)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Info Card */}
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.colors.info.main}
              />
              <Text style={styles.infoTitle}>About {option.type.toUpperCase()} Options</Text>
            </View>
            <Text style={styles.infoText}>
              {option.type === 'call'
                ? 'A call option gives you the right to buy the asset at the strike price before expiry. You profit if the asset price rises above the strike price.'
                : 'A put option gives you the right to sell the asset at the strike price before expiry. You profit if the asset price falls below the strike price.'}
            </Text>
          </Card>

          <Button
            title={`Buy ${option.type.toUpperCase()} Option`}
            onPress={handleTrade}
            variant="primary"
            size="large"
            fullWidth
            disabled={!quantity || parseFloat(quantity) <= 0}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
