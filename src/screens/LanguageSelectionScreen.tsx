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
import { useSettings, Language } from '../context/SettingsContext';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
];

export const LanguageSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeMode, theme } = useTheme();
  const { language, setLanguage } = useSettings();

  const handleLanguageSelect = async (selectedLanguage: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setLanguage(selectedLanguage);
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
            Select Language
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Language List */}
        <Card style={styles.languageCard}>
          {languages.map((lang, index) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => handleLanguageSelect(lang.code)}
              style={[
                styles.languageItem,
                index < languages.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border.light,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.languageItemLeft}>
                <View
                  style={[
                    styles.languageIconContainer,
                    { backgroundColor: `${theme.colors.primary[400]}20` },
                  ]}
                >
                  <Ionicons
                    name="language-outline"
                    size={22}
                    color={theme.colors.primary[400]}
                  />
                </View>
                <View style={styles.languageItemText}>
                  <Text style={[styles.languageName, { color: theme.colors.text.primary }]}>
                    {lang.name}
                  </Text>
                  <Text
                    style={[styles.languageNativeName, { color: theme.colors.text.secondary }]}
                  >
                    {lang.nativeName}
                  </Text>
                </View>
              </View>
              {language === lang.code && (
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
  languageCard: {
    padding: 0,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  languageItemText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageNativeName: {
    fontSize: 14,
  },
});

