import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 48,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 56,
      },
    };

    if (variant === 'primary') {
      return [
        baseStyle,
        sizeStyles[size],
        fullWidth && { width: '100%' },
        style,
      ];
    }

    if (variant === 'secondary') {
      return [
        baseStyle,
        sizeStyles[size],
        { backgroundColor: theme.colors.secondary[500] },
        fullWidth && { width: '100%' },
        style,
      ];
    }

    if (variant === 'outline') {
      return [
        baseStyle,
        sizeStyles[size],
        {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.medium,
        },
        fullWidth && { width: '100%' },
        style,
      ];
    }

    return [
      baseStyle,
      sizeStyles[size],
      { backgroundColor: 'transparent' },
      fullWidth && { width: '100%' },
      style,
    ];
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: theme.typography.fontWeight.semiBold,
    };

    const sizeStyles = {
      small: { fontSize: theme.typography.fontSize.sm },
      medium: { fontSize: theme.typography.fontSize.md },
      large: { fontSize: theme.typography.fontSize.lg },
    };

    const variantStyles = {
      primary: { color: theme.colors.text.primary },
      secondary: { color: theme.colors.background.primary },
      outline: { color: theme.colors.text.primary },
      ghost: { color: theme.colors.text.primary },
    };

    return [
      baseStyle,
      sizeStyles[size],
      variantStyles[variant],
      disabled && { opacity: 0.5 },
      textStyle,
    ];
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyles(), (disabled || loading) && { opacity: 0.6 }]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
          borderRadius={theme.borderRadius.lg}
        />
        {loading ? (
          <ActivityIndicator color={theme.colors.text.primary} />
        ) : (
          <Text style={getTextStyles()}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), (disabled || loading) && { opacity: 0.6 }]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'secondary'
              ? theme.colors.background.primary
              : theme.colors.text.primary
          }
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
