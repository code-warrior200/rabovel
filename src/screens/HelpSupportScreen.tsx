import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

export const HelpSupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeMode, theme } = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleOpenLink = async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open this link');
    }
  };

  const handleSendEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message fields');
      return;
    }

    const emailUrl = `mailto:support@rabovel.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    handleOpenLink(emailUrl);
  };

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleOpenLink('tel:+2348000000000');
  };

  const faqItems = [
    {
      id: '1',
      question: 'How do I stake my assets?',
      answer:
        'Navigate to the Staking screen, select a staking pool, enter the amount you want to stake, choose a lock period, and confirm your stake.',
    },
    {
      id: '2',
      question: 'How are rewards calculated?',
      answer:
        'Rewards are calculated based on the APY (Annual Percentage Yield) of the staking pool and the lock period you choose. Longer lock periods typically offer higher APY rates.',
    },
    {
      id: '3',
      question: 'Can I withdraw my staked assets early?',
      answer:
        'Staked assets are locked for the duration of the lock period you selected. Early withdrawal is not available to ensure the security and stability of the staking pools.',
    },
    {
      id: '4',
      question: 'How do I trade options?',
      answer:
        'Go to the Trading screen, select an asset, choose between Call or Put options, set your strike price and expiry date, then execute your trade.',
    },
    {
      id: '5',
      question: 'What currencies are supported?',
      answer:
        'We support multiple currencies including NGN, USD, EUR, GBP, ZAR, KES, and GHS. You can change your default currency in Settings.',
    },
  ];

  const contactMethods = [
    {
      id: 'email',
      title: 'Email Support',
      description: 'support@rabovel.com',
      icon: 'mail-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleOpenLink('mailto:support@rabovel.com');
      },
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: '+234 800 000 0000',
      icon: 'call-outline' as keyof typeof Ionicons.glyphMap,
      onPress: handleCall,
    },
    {
      id: 'website',
      title: 'Visit Help Center',
      description: 'rabovel.com/support',
      icon: 'globe-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleOpenLink('https://rabovel.com/support');
      },
    },
  ];

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
            Help & Support
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Contact Us
          </Text>
          <Card style={styles.contactCard}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={method.id}
                onPress={method.onPress}
                style={[
                  styles.contactItem,
                  index < contactMethods.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.light,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.contactItemLeft}>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${theme.colors.primary[400]}20` },
                    ]}
                  >
                    <Ionicons
                      name={method.icon}
                      size={22}
                      color={theme.colors.primary[400]}
                    />
                  </View>
                  <View style={styles.contactItemText}>
                    <Text style={[styles.contactTitle, { color: theme.colors.text.primary }]}>
                      {method.title}
                    </Text>
                    <Text style={[styles.contactDescription, { color: theme.colors.text.secondary }]}>
                      {method.description}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Send Message */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Send Us a Message
          </Text>
          <Card style={styles.messageCard}>
            <Input
              label="Subject"
              placeholder="Enter subject"
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
            />
            <Input
              label="Message"
              placeholder="Enter your message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            <Button
              title="Send Message"
              onPress={handleSendEmail}
              variant="primary"
              size="large"
              fullWidth
              style={styles.sendButton}
            />
          </Card>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Frequently Asked Questions
          </Text>
          {faqItems.map((faq) => (
            <Card key={faq.id} style={styles.faqCard}>
              <Text style={[styles.faqQuestion, { color: theme.colors.text.primary }]}>
                {faq.question}
              </Text>
              <Text style={[styles.faqAnswer, { color: theme.colors.text.secondary }]}>
                {faq.answer}
              </Text>
            </Card>
          ))}
        </View>
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
  contactCard: {
    padding: 0,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactItemText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
  },
  messageCard: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sendButton: {
    marginTop: 8,
  },
  faqCard: {
    marginBottom: 12,
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

