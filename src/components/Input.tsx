import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      paddingHorizontal: theme.spacing.md,
      minHeight: 48,
    },
    inputContainerError: {
      borderColor: theme.colors.error.main,
    },
    inputContainerDisabled: {
      opacity: 0.6,
    },
    input: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
      paddingVertical: theme.spacing.sm,
    },
    inputWithLeftIcon: {
      marginLeft: theme.spacing.sm,
    },
    inputWithRightIcon: {
      marginRight: theme.spacing.sm,
    },
    leftIcon: {
      marginRight: theme.spacing.sm,
    },
    rightIcon: {
      marginLeft: theme.spacing.sm,
    },
    error: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.error.main,
      marginTop: theme.spacing.xs,
    },
  });
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          error && styles.inputContainerError,
          props.editable === false && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={theme.colors.text.tertiary}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
