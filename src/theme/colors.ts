export const colors = {
  // Primary Colors
  primary: {
    50: '#E8F4FD',
    100: '#B8DFFA',
    200: '#88CAF7',
    300: '#58B5F4',
    400: '#28A0F1',
    500: '#1E7CC7', // Main Primary
    600: '#18599D',
    700: '#123673',
    800: '#0C1349',
    900: '#060F1F',
  },
  
  // Secondary Colors (Gold/Accent)
  secondary: {
    50: '#FFF9E6',
    100: '#FFEEB3',
    200: '#FFE380',
    300: '#FFD84D',
    400: '#FFCD1A',
    500: '#E6B800', // Main Secondary
    600: '#B38F00',
    700: '#806600',
    800: '#4D3D00',
    900: '#1A1400',
  },
  
  // Background Colors
  background: {
    primary: '#0A0E27',
    secondary: '#141B3D',
    tertiary: '#1E284F',
    card: '#252D5A',
    overlay: 'rgba(10, 14, 39, 0.9)',
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B8C5D9',
    tertiary: '#8B9BB3',
    disabled: '#5A6780',
    inverse: '#0A0E27',
  },
  
  // Status Colors
  success: {
    light: '#4ADE80',
    main: '#22C55E',
    dark: '#16A34A',
  },
  
  error: {
    light: '#F87171',
    main: '#EF4444',
    dark: '#DC2626',
  },
  
  warning: {
    light: '#FBBF24',
    main: '#F59E0B',
    dark: '#D97706',
  },
  
  info: {
    light: '#60A5FA',
    main: '#3B82F6',
    dark: '#2563EB',
  },
  
  // Border Colors
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Gradient Colors
  gradient: {
    primary: ['#1E7CC7', '#3B82F6'] as readonly [string, string],
    secondary: ['#E6B800', '#FFCD1A'] as readonly [string, string],
    success: ['#22C55E', '#4ADE80'] as readonly [string, string],
    error: ['#EF4444', '#F87171'] as readonly [string, string],
    background: ['#0A0E27', '#141B3D'] as readonly [string, string],
  },
};
