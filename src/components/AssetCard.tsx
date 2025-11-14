import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Asset } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Card } from './Card';

interface AssetCardProps {
  asset: Asset;
  onPress?: () => void;
  showChange?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onPress,
  showChange = true,
}) => {
  const { theme } = useTheme();
  const isPositive = asset.changePercent24h >= 0;

  const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
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
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  iconText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  assetDetails: {
    flex: 1,
  },
  symbol: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  name: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  changeContainer: {
    marginTop: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  positiveChange: {
    backgroundColor: theme.colors.success.dark + '20',
  },
  negativeChange: {
    backgroundColor: theme.colors.error.dark + '20',
  },
  changeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  positiveText: {
    color: theme.colors.success.light,
  },
    negativeText: {
      color: theme.colors.error.light,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.assetInfo}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>
                {asset.symbol.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.assetDetails}>
              <Text style={styles.symbol}>{asset.symbol}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {asset.name}
              </Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {formatCurrency(asset.price, asset.type === 'token' ? 'NGN' : 'NGN')}
            </Text>
            {showChange && (
              <View
                style={[
                  styles.changeContainer,
                  isPositive ? styles.positiveChange : styles.negativeChange,
                ]}
              >
                <Text
                  style={[
                    styles.changeText,
                    isPositive ? styles.positiveText : styles.negativeText,
                  ]}
                >
                  {formatPercent(asset.changePercent24h)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
