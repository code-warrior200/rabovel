import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type Language = 'en' | 'fr' | 'es' | 'pt' | 'sw';
export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'ZAR' | 'KES' | 'GHS';

interface SettingsContextType {
  language: Language;
  currency: Currency;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  setLanguage: (language: Language) => Promise<void>;
  setCurrency: (currency: Currency) => Promise<void>;
  setPushNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setEmailNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

const LANGUAGE_KEY = 'user_language';
const CURRENCY_KEY = 'user_currency';
const PUSH_NOTIFICATIONS_KEY = 'push_notifications_enabled';
const EMAIL_NOTIFICATIONS_KEY = 'email_notifications_enabled';

// Helper functions for storage
const setItemAsync = async (key: string, value: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

const getItemAsync = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [currency, setCurrencyState] = useState<Currency>('NGN');
  const [pushNotificationsEnabled, setPushNotificationsEnabledState] = useState<boolean>(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabledState] = useState<boolean>(true);

  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await getItemAsync(LANGUAGE_KEY);
      if (savedLanguage && ['en', 'fr', 'es', 'pt', 'sw'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }

      const savedCurrency = await getItemAsync(CURRENCY_KEY);
      if (savedCurrency && ['NGN', 'USD', 'EUR', 'GBP', 'ZAR', 'KES', 'GHS'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency as Currency);
      }

      const savedPushNotifications = await getItemAsync(PUSH_NOTIFICATIONS_KEY);
      if (savedPushNotifications !== null) {
        setPushNotificationsEnabledState(savedPushNotifications === 'true');
      }

      const savedEmailNotifications = await getItemAsync(EMAIL_NOTIFICATIONS_KEY);
      if (savedEmailNotifications !== null) {
        setEmailNotificationsEnabledState(savedEmailNotifications === 'true');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    await setItemAsync(LANGUAGE_KEY, newLanguage);
  };

  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    await setItemAsync(CURRENCY_KEY, newCurrency);
  };

  const setPushNotificationsEnabled = async (enabled: boolean) => {
    setPushNotificationsEnabledState(enabled);
    await setItemAsync(PUSH_NOTIFICATIONS_KEY, enabled.toString());
  };

  const setEmailNotificationsEnabled = async (enabled: boolean) => {
    setEmailNotificationsEnabledState(enabled);
    await setItemAsync(EMAIL_NOTIFICATIONS_KEY, enabled.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        currency,
        pushNotificationsEnabled,
        emailNotificationsEnabled,
        setLanguage,
        setCurrency,
        setPushNotificationsEnabled,
        setEmailNotificationsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

