import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

export const WithdrawScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeMode, theme } = useTheme();
  const { walletBalance } = useApp();
  const { currency } = useSettings();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawalMethods = [
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'Transfer to your bank account',
      icon: 'card-outline' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.primary[400],
      requiresDetails: true,
    },
    {
      id: 'wallet',
      title: 'Digital Wallet',
      description: 'Transfer to mobile wallet',
      icon: 'wallet-outline' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.secondary[400],
      requiresDetails: true,
    },
    {
      id: 'crypto',
      title: 'Cryptocurrency',
      description: 'Withdraw to crypto wallet',
      icon: 'logo-bitcoin' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.warning.main,
      requiresDetails: true,
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMethod(methodId);
  };

  const handleQuickAmount = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(value);
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }

    if (parseFloat(amount) > walletBalance) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance for this withdrawal.');
      return;
    }

    if (!selectedMethod) {
      Alert.alert('Select Method', 'Please select a withdrawal method.');
      return;
    }

    const selectedMethodData = withdrawalMethods.find((m) => m.id === selectedMethod);
    if (selectedMethodData?.requiresDetails) {
      if (!accountNumber || !accountName || !bankName) {
        Alert.alert('Missing Details', 'Please fill in all required account details.');
        return;
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);

    // Simulate withdrawal processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Withdrawal Initiated',
      `Your withdrawal of ${formatCurrency(parseFloat(amount), currency)} has been initiated. It will be processed within 1-3 business days.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const quickAmounts = [
    (walletBalance * 0.25).toFixed(0),
    (walletBalance * 0.5).toFixed(0),
    (walletBalance * 0.75).toFixed(0),
    walletBalance.toFixed(0),
  ].filter((val) => parseFloat(val) > 0);

  const selectedMethodData = withdrawalMethods.find((m) => m.id === selectedMethod);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      edges={['top']}
    >
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
              style={[styles.backButton, { backgroundColor: theme.colors.background.card }]}
            >
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
              Withdraw Funds
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Current Balance */}
          <Card style={styles.balanceCard}>
            <LinearGradient
              colors={theme.colors.gradient.secondary}
              style={styles.balanceGradient}
            >
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>
                {formatCurrency(walletBalance, currency)}
              </Text>
            </LinearGradient>
          </Card>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Withdrawal Amount
            </Text>
            <Card style={styles.amountCard}>
              <Input
                label="Amount"
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                leftIcon={
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                }
                style={styles.amountInput}
              />
              {quickAmounts.length > 0 && (
                <View style={styles.quickAmounts}>
                  {quickAmounts.map((value) => (
                    <TouchableOpacity
                      key={value}
                      onPress={() => handleQuickAmount(value)}
                      style={[
                        styles.quickAmountButton,
                        {
                          backgroundColor:
                            amount === value
                              ? theme.colors.secondary[400]
                              : theme.colors.background.tertiary,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickAmountText,
                          {
                            color:
                              amount === value
                                ? theme.colors.text.primary
                                : theme.colors.text.secondary,
                          },
                        ]}
                      >
                        {formatCurrency(parseFloat(value), currency)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>
          </View>

          {/* Withdrawal Methods */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Withdrawal Method
            </Text>
            <View style={styles.methodsContainer}>
              {withdrawalMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => handleMethodSelect(method.id)}
                  activeOpacity={0.7}
                  style={styles.methodCardWrapper}
                >
                  <Card
                    style={[
                      styles.methodCard,
                      selectedMethod === method.id && {
                        borderWidth: 2,
                        borderColor: method.color,
                      },
                    ]}
                  >
                    <View style={styles.methodHeader}>
                      <View
                        style={[
                          styles.methodIconContainer,
                          { backgroundColor: `${method.color}20` },
                        ]}
                      >
                        <Ionicons name={method.icon} size={24} color={method.color} />
                      </View>
                      <View style={styles.methodInfo}>
                        <Text style={[styles.methodTitle, { color: theme.colors.text.primary }]}>
                          {method.title}
                        </Text>
                        <Text
                          style={[styles.methodDescription, { color: theme.colors.text.secondary }]}
                        >
                          {method.description}
                        </Text>
                      </View>
                      {selectedMethod === method.id && (
                        <View
                          style={[
                            styles.selectedIndicator,
                            { backgroundColor: method.color },
                          ]}
                        >
                          <Ionicons name="checkmark" size={16} color={theme.colors.text.primary} />
                        </View>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Details (if bank transfer selected) */}
          {selectedMethodData?.requiresDetails && selectedMethod && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
                Account Details
              </Text>
              <Card style={styles.detailsCard}>
                <Input
                  label="Account Number"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="numeric"
                  leftIcon={
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                  }
                  style={styles.detailInput}
                />
                <Input
                  label="Account Name"
                  placeholder="Enter account name"
                  value={accountName}
                  onChangeText={setAccountName}
                  leftIcon={
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                  }
                  style={styles.detailInput}
                />
                <Input
                  label="Bank Name"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChangeText={setBankName}
                  leftIcon={
                    <Ionicons
                      name="business-outline"
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                  }
                  style={styles.detailInput}
                />
              </Card>
            </View>
          )}

          {/* Withdraw Button */}
          <Button
            title="Withdraw"
            onPress={handleWithdraw}
            variant="secondary"
            size="large"
            fullWidth
            loading={isProcessing}
            style={styles.withdrawButton}
          />

          {/* Info */}
          <View style={styles.infoSection}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={theme.colors.text.tertiary}
            />
            <Text style={[styles.infoText, { color: theme.colors.text.tertiary }]}>
              Withdrawals are processed within 1-3 business days. Minimum withdrawal is{' '}
              {formatCurrency(1000, currency)}.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 20,
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
  balanceCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: 24,
    borderRadius: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  amountCard: {
    padding: 20,
  },
  amountInput: {
    marginBottom: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  methodsContainer: {
    gap: 12,
  },
  methodCardWrapper: {
    marginBottom: 0,
  },
  methodCard: {
    padding: 16,
    borderRadius: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 13,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    padding: 20,
  },
  detailInput: {
    marginBottom: 16,
  },
  withdrawButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});

