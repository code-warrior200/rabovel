import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

export const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeMode, theme } = useTheme();

  const handleOpenLink = async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const aboutSections = [
    {
      id: 'version',
      title: 'Version',
      value: '1.0.0',
      icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'description',
      title: 'Description',
      value: 'Your all-in-one platform for cryptocurrency trading, staking, and portfolio management.',
      icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'features',
      title: 'Key Features',
      value: [
        'Cryptocurrency Trading',
        'Staking & Rewards',
        'Portfolio Management',
        'Market Analytics',
        'Options Trading',
      ],
      icon: 'star-outline' as keyof typeof Ionicons.glyphMap,
    },
  ];

  const links = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      url: 'https://rabovel.com/privacy',
      icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      url: 'https://rabovel.com/terms',
      icon: 'document-outline' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'website',
      title: 'Visit Website',
      url: 'https://rabovel.com',
      icon: 'globe-outline' as keyof typeof Ionicons.glyphMap,
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
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>About</Text>
          <View style={styles.placeholder} />
        </View>

        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={theme.colors.gradient.primary}
            style={styles.logo}
          >
            <Ionicons
              name="wallet-outline"
              size={48}
              color={theme.colors.text.primary}
            />
          </LinearGradient>
          <Text style={[styles.appName, { color: theme.colors.text.primary }]}>Rabovel</Text>
          <Text style={[styles.appTagline, { color: theme.colors.text.secondary }]}>
            Your Financial Future, Simplified
          </Text>
        </View>

        {/* About Sections */}
        {aboutSections.map((section) => (
          <Card key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconContainer,
                  { backgroundColor: `${theme.colors.primary[400]}20` },
                ]}
              >
                <Ionicons
                  name={section.icon}
                  size={22}
                  color={theme.colors.primary[400]}
                />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                {section.title}
              </Text>
            </View>
            {section.id === 'features' ? (
              <View style={styles.featuresList}>
                {(section.value as string[]).map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={theme.colors.success.main}
                    />
                    <Text style={[styles.featureText, { color: theme.colors.text.secondary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.sectionValue, { color: theme.colors.text.secondary }]}>
                {section.value as string}
              </Text>
            )}
          </Card>
        ))}

        {/* Links */}
        <View style={styles.linksSection}>
          <Text style={[styles.linksTitle, { color: theme.colors.text.secondary }]}>Links</Text>
          <Card style={styles.linksCard}>
            {links.map((link, index) => (
              <TouchableOpacity
                key={link.id}
                onPress={() => handleOpenLink(link.url)}
                style={[
                  styles.linkItem,
                  index < links.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.light,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.linkItemLeft}>
                  <View
                    style={[
                      styles.linkIconContainer,
                      { backgroundColor: `${theme.colors.primary[400]}20` },
                    ]}
                  >
                    <Ionicons
                      name={link.icon}
                      size={20}
                      color={theme.colors.primary[400]}
                    />
                  </View>
                  <Text style={[styles.linkText, { color: theme.colors.text.primary }]}>
                    {link.title}
                  </Text>
                </View>
                <Ionicons
                  name="open-outline"
                  size={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={[styles.copyrightText, { color: theme.colors.text.tertiary }]}>
            © 2024 Rabovel. All rights reserved.
          </Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
  },
  linksSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  linksTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  linksCard: {
    padding: 0,
    overflow: 'hidden',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  linkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  copyright: {
    alignItems: 'center',
    marginTop: 16,
  },
  copyrightText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

