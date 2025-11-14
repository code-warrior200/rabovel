import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeMode, toggleTheme, theme, syncWithDevice, setSyncWithDevice } = useTheme();
  const {
    language,
    currency,
    pushNotificationsEnabled,
    emailNotificationsEnabled,
    setPushNotificationsEnabled,
    setEmailNotificationsEnabled,
  } = useSettings();

  const handleToggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTheme();
  };

  const handleToggleSyncWithDevice = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setSyncWithDevice(!syncWithDevice);
  };

  const handleTogglePushNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setPushNotificationsEnabled(!pushNotificationsEnabled);
  };

  const handleToggleEmailNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setEmailNotificationsEnabled(!emailNotificationsEnabled);
  };

  const getLanguageName = (code: string): string => {
    const languages: { [key: string]: string } = {
      en: 'English',
      fr: 'French',
      es: 'Spanish',
      pt: 'Portuguese',
      sw: 'Swahili',
    };
    return languages[code] || 'English';
  };

  const settingsSections = [
    {
      id: 'appearance',
      title: 'Appearance',
      items: [
        {
          id: 'sync-device',
          title: 'Sync with Device Theme',
          description: syncWithDevice 
            ? 'Theme follows your device settings' 
            : 'Theme is set manually',
          icon: 'phone-portrait-outline',
          rightComponent: (
            <Switch
              value={syncWithDevice}
              onValueChange={handleToggleSyncWithDevice}
              trackColor={{
                false: theme.colors.border.medium,
                true: theme.colors.primary[400],
              }}
              thumbColor={theme.colors.text.primary}
            />
          ),
        },
        {
          id: 'theme',
          title: 'Dark Mode',
          description: syncWithDevice 
            ? 'Synced with device (change disabled)' 
            : 'Switch between light and dark theme',
          icon: themeMode === 'dark' ? 'moon' : 'sunny',
          rightComponent: (
            <Switch
              value={themeMode === 'dark'}
              onValueChange={handleToggleTheme}
              disabled={syncWithDevice}
              trackColor={{
                false: theme.colors.border.medium,
                true: theme.colors.primary[400],
              }}
              thumbColor={theme.colors.text.primary}
            />
          ),
        },
      ],
    },
    {
      id: 'general',
      title: 'General',
      items: [
        {
          id: 'language',
          title: 'Language',
          description: getLanguageName(language),
          icon: 'language-outline',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            (navigation as any).navigate('LanguageSelection');
          },
        },
        {
          id: 'currency',
          title: 'Default Currency',
          description: currency,
          icon: 'cash-outline',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            (navigation as any).navigate('CurrencySelection');
          },
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      items: [
        {
          id: 'push',
          title: 'Push Notifications',
          description: 'Receive push notifications',
          icon: 'notifications-outline',
          rightComponent: (
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={handleTogglePushNotifications}
              trackColor={{
                false: theme.colors.border.medium,
                true: theme.colors.primary[400],
              }}
              thumbColor={theme.colors.text.primary}
            />
          ),
        },
        {
          id: 'email',
          title: 'Email Notifications',
          description: 'Receive email updates',
          icon: 'mail-outline',
          rightComponent: (
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={handleToggleEmailNotifications}
              trackColor={{
                false: theme.colors.border.medium,
                true: theme.colors.primary[400],
              }}
              thumbColor={theme.colors.text.primary}
            />
          ),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]} edges={['top']}>
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
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              {section.title}
            </Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={'onPress' in item ? item.onPress : undefined}
                  style={[
                    styles.settingItem,
                    index < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border.light,
                    },
                  ]}
                  activeOpacity={'onPress' in item ? 0.7 : 1}
                  disabled={'onPress' in item ? false : true}
                >
                  <View style={styles.settingItemLeft}>
                    <View
                      style={[
                        styles.settingIconContainer,
                        { backgroundColor: `${theme.colors.primary[400]}20` },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as keyof typeof Ionicons.glyphMap}
                        size={22}
                        color={theme.colors.primary[400]}
                      />
                    </View>
                    <View style={styles.settingItemText}>
                      <Text style={[styles.settingItemTitle, { color: theme.colors.text.primary }]}>
                        {item.title}
                      </Text>
                      {item.description && (
                        <Text
                          style={[
                            styles.settingItemDescription,
                            { color: theme.colors.text.secondary },
                          ]}
                        >
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {'rightComponent' in item ? (
                    item.rightComponent
                  ) : (
                    <Ionicons
                      name="chevron-forward-outline"
                      size={20}
                      color={theme.colors.text.tertiary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: theme.colors.text.tertiary }]}>
            Rabovel v1.0.0
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
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingItemDescription: {
    fontSize: 14,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  appInfoText: {
    fontSize: 12,
  },
});

