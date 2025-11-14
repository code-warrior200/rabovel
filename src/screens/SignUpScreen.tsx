import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { Ionicons } from '@expo/vector-icons';

export const SignUpScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { signUp, isLoading } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
      minHeight: '100%',
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    logoContainer: {
      marginBottom: theme.spacing.lg,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    form: {
      width: '100%',
    },
    eyeIcon: {
      padding: theme.spacing.xs,
    },
    passwordRequirements: {
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
    },
    passwordRequirementsTitle: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    passwordRequirement: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    signUpButton: {
      marginBottom: theme.spacing.md,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border.light,
    },
    dividerText: {
      marginHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.tertiary,
    },
    socialButton: {
      marginBottom: theme.spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    footerText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
    },
    footerLink: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.primary[400],
      fontWeight: theme.typography.fontWeight.semiBold,
    },
  });

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.error;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signUp(email, password, name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      Alert.alert('Sign Up Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={theme.colors.gradient.background}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={theme.colors.gradient.primary}
                  style={styles.logo}
                >
                  <Ionicons name="wallet" size={40} color={theme.colors.text.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Rabovel to start staking and trading</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.name}
                leftIcon={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                }
              />

              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                leftIcon={
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                }
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.password}
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                  </TouchableOpacity>
                }
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.confirmPassword}
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                }
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                  </TouchableOpacity>
                }
              />

              <View style={styles.passwordRequirements}>
                <Text style={styles.passwordRequirementsTitle}>Password must contain:</Text>
                <Text style={styles.passwordRequirement}>
                  • At least 8 characters
                </Text>
                <Text style={styles.passwordRequirement}>
                  • One uppercase letter
                </Text>
                <Text style={styles.passwordRequirement}>
                  • One lowercase letter
                </Text>
                <Text style={styles.passwordRequirement}>
                  • One number
                </Text>
              </View>

              <Button
                title="Sign Up"
                onPress={handleSignUp}
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                style={styles.signUpButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Continue with Google"
                onPress={() => {}}
                variant="outline"
                size="large"
                fullWidth
                style={styles.socialButton}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn' as never)}
              >
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
