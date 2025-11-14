import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSettings, Currency } from '../context/SettingsContext';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const currencies: { code: Currency; name: string; symbol: string; flag: string }[] = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
];

export const CurrencySelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeMode, theme } = useTheme();
  const { currency, setCurrency } = useSettings();

  const handleCurrencySelect = async (selectedCurrency: Currency) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setCurrency(selectedCurrency);
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      edges={['top']}
    >
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.colors.background.card }]}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Select Currency
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Currency List */}
        <Card style={styles.currencyCard}>
          {currencies.map((curr, index) => (
            <TouchableOpacity
              key={curr.code}
              onPress={() => handleCurrencySelect(curr.code)}
              style={[
                styles.currencyItem,
                index < currencies.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border.light,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.currencyItemLeft}>
                <View
                  style={[
                    styles.currencyIconContainer,
                    { backgroundColor: `${theme.colors.primary[400]}20` },
                  ]}
                >
                  <Text style={styles.currencyFlag}>{curr.flag}</Text>
                </View>
                <View style={styles.currencyItemText}>
                  <Text style={[styles.currencyName, { color: theme.colors.text.primary }]}>
                    {curr.name}
                  </Text>
                  <Text
                    style={[styles.currencyCode, { color: theme.colors.text.secondary }]}
                  >
                    {curr.code} • {curr.symbol}
                  </Text>
                </View>
              </View>
              {currency === curr.code && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={theme.colors.primary[400]}
                />
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  currencyCard: {
    padding: 0,
    overflow: 'hidden',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  currencyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currencyFlag: {
    fontSize: 24,
  },
  currencyItemText: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  currencyCode: {
    fontSize: 14,
  },
});

