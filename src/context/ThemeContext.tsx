import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform, Appearance, ColorSchemeName } from 'react-native';
import { colors } from '../theme/colors';
import { lightColors } from '../theme/lightColors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

export type ThemeMode = 'light' | 'dark';

// Create theme object
const createTheme = (mode: ThemeMode) => {
  const themeColors = mode === 'dark' ? colors : lightColors;
  const baseThemeObj = {
    colors: themeColors,
    typography,
    spacing,
    borderRadius,
  };
  
  // Create the theme object with baseTheme included
  const themeObj = {
    colors: themeColors,
    typography,
    spacing,
    borderRadius,
    baseTheme: baseThemeObj,
    shadows: {
      small: {
        shadowColor: mode === 'dark' ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: mode === 'dark' ? 0.1 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      medium: {
        shadowColor: mode === 'dark' ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: mode === 'dark' ? 0.15 : 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
      large: {
        shadowColor: mode === 'dark' ? '#000' : '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: mode === 'dark' ? 0.2 : 0.1,
        shadowRadius: 16,
        elevation: 8,
      },
    },
  };
  
  return themeObj;
};

export type Theme = ReturnType<typeof createTheme>;

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  syncWithDevice: boolean;
  setSyncWithDevice: (sync: boolean) => void;
  theme: Theme;
}

const THEME_MODE_KEY = 'theme_mode';
const SYNC_WITH_DEVICE_KEY = 'sync_with_device';

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

// Create a default theme for the context initial value
const defaultTheme = createTheme('dark');
const defaultContextValue: ThemeContextType = {
  themeMode: 'dark',
  toggleTheme: () => {},
  setThemeMode: async () => {},
  syncWithDevice: true,
  setSyncWithDevice: async () => {},
  theme: defaultTheme,
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with a default theme immediately to ensure theme is always available
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const colorScheme = Appearance.getColorScheme();
      return colorScheme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [syncWithDevice, setSyncWithDeviceState] = useState<boolean>(true);
  
  // Create theme immediately so it's always available
  const theme = React.useMemo(() => createTheme(themeMode), [themeMode]);

  // Get device color scheme
  const getDeviceColorScheme = (): ThemeMode => {
    const colorScheme: ColorSchemeName = Appearance.getColorScheme();
    return colorScheme === 'light' ? 'light' : 'dark';
  };

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreferences();
  }, []);

  // Listen to device theme changes when sync is enabled
  useEffect(() => {
    if (!syncWithDevice) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const deviceMode: ThemeMode = colorScheme === 'light' ? 'light' : 'dark';
      setThemeModeState(deviceMode);
      // Don't save to storage when syncing with device - let it be dynamic
    });

    return () => subscription.remove();
  }, [syncWithDevice]);

  const loadThemePreferences = async () => {
    try {
      const savedSync = await getItemAsync(SYNC_WITH_DEVICE_KEY);
      const shouldSync = savedSync === null || savedSync === 'true'; // Default to true
      setSyncWithDeviceState(shouldSync);

      if (shouldSync) {
        // Use device theme when syncing
        const deviceMode = getDeviceColorScheme();
        setThemeModeState(deviceMode);
      } else {
        // Use saved preference when not syncing
        const savedMode = await getItemAsync(THEME_MODE_KEY);
        if (savedMode === 'light' || savedMode === 'dark') {
          setThemeModeState(savedMode);
        } else {
          // Fallback to device theme if no saved preference
          const deviceMode = getDeviceColorScheme();
          setThemeModeState(deviceMode);
        }
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
      // Fallback to device theme on error
      const deviceMode = getDeviceColorScheme();
      setThemeModeState(deviceMode);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    // Only save to storage if not syncing with device
    if (!syncWithDevice) {
      await setItemAsync(THEME_MODE_KEY, mode);
    }
  };

  const setSyncWithDevice = async (sync: boolean) => {
    setSyncWithDeviceState(sync);
    await setItemAsync(SYNC_WITH_DEVICE_KEY, sync.toString());
    
    if (sync) {
      // When enabling sync, switch to device theme
      const deviceMode = getDeviceColorScheme();
      setThemeModeState(deviceMode);
    } else {
      // When disabling sync, save current theme
      await setItemAsync(THEME_MODE_KEY, themeMode);
    }
  };

  const toggleTheme = () => {
    // If syncing with device, disable sync first
    if (syncWithDevice) {
      setSyncWithDevice(false);
    }
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleTheme,
        setThemeMode,
        syncWithDevice,
        setSyncWithDevice,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Ensure theme is always available
  if (!context || !context.theme) {
    // Fallback theme if somehow theme is missing
    const fallbackTheme = createTheme('dark');
    return {
      themeMode: 'dark' as ThemeMode,
      toggleTheme: () => {},
      setThemeMode: async () => {},
      syncWithDevice: true,
      setSyncWithDevice: async () => {},
      theme: fallbackTheme,
    };
  }
  return context;
};

