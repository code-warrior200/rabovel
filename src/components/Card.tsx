import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'medium',
}) => {
  const { theme } = useTheme();
  
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'medium':
        return theme.spacing.md;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          ...theme.shadows.medium,
          backgroundColor: theme.colors.background.card,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.background.card,
          borderWidth: 1,
          borderColor: theme.colors.border.light,
        };
      default:
        return {
          backgroundColor: theme.colors.background.card,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyle(),
        {
          padding: getPadding(),
          borderRadius: theme.borderRadius.xl,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
