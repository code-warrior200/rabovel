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
import { DEFAULT_CREDENTIALS } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../utils/validation';
import { Ionicons } from '@expo/vector-icons';

export const SignInScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { signIn, isLoading } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

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
      marginBottom: theme.spacing['3xl'],
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
    },
    form: {
      width: '100%',
    },
    eyeIcon: {
      padding: theme.spacing.xs,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.primary[400],
      fontWeight: theme.typography.fontWeight.medium,
    },
    signInButton: {
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
      marginTop: theme.spacing.xl,
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
    demoCredentialsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    demoCredentialsText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.primary[400],
      fontWeight: theme.typography.fontWeight.medium,
      marginLeft: theme.spacing.xs,
    },
    demoCredentialsBox: {
      marginTop: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      width: '100%',
    },
    demoCredentialsLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      fontFamily: 'monospace',
    },
    useDemoButton: {
      marginTop: theme.spacing.sm,
    },
  });

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Please check your credentials and try again.';
      Alert.alert('Sign In Failed', errorMessage);
    }
  };

  const handleUseDemoCredentials = () => {
    setEmail(DEFAULT_CREDENTIALS.email);
    setPassword(DEFAULT_CREDENTIALS.password);
    setErrors({});
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
                  <Ionicons name="lock-closed" size={40} color={theme.colors.text.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue to Rabovel</Text>
              
              {/* Demo Credentials Info */}
              <TouchableOpacity
                style={styles.demoCredentialsButton}
                onPress={() => setShowDemoCredentials(!showDemoCredentials)}
              >
                <Ionicons
                  name={showDemoCredentials ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={theme.colors.primary[400]}
                />
                <Text style={styles.demoCredentialsText}>Demo Credentials</Text>
              </TouchableOpacity>
              
              {showDemoCredentials && (
                <View style={styles.demoCredentialsBox}>
                  <Text style={styles.demoCredentialsLabel}>Email: {DEFAULT_CREDENTIALS.email}</Text>
                  <Text style={styles.demoCredentialsLabel}>Password: {DEFAULT_CREDENTIALS.password}</Text>
                  <Button
                    title="Use Demo Credentials"
                    onPress={handleUseDemoCredentials}
                    variant="outline"
                    size="small"
                    style={styles.useDemoButton}
                  />
                </View>
              )}
            </View>

            {/* Form */}
            <View style={styles.form}>
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
                placeholder="Enter your password"
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleSignIn}
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                style={styles.signInButton}
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
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp' as never)}
              >
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
