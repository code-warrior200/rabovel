import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';

// Default dark theme (for backward compatibility)
const baseThemeObj = {
  colors,
  typography,
  spacing,
  borderRadius,
};

// Create the theme object with baseTheme included
const themeObj = {
  colors,
  typography,
  spacing,
  borderRadius,
  baseTheme: baseThemeObj,
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const theme = themeObj;

export type Theme = typeof theme;

// Re-export useTheme hook for convenience
export { useTheme } from '../context/ThemeContext';
export type { ThemeMode } from '../context/ThemeContext';
