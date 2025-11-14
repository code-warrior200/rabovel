import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradient: readonly [string, string];
}

export const OnboardingScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    skipContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      alignItems: 'flex-end',
    },
    skipButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    skipText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    scrollView: {
      flex: 1,
    },
    slide: {
      width: SCREEN_WIDTH,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    slideContent: {
      alignItems: 'center',
      maxWidth: 320,
    },
    iconContainer: {
      marginBottom: theme.spacing['3xl'],
    },
    iconGradient: {
      width: 140,
      height: 140,
      borderRadius: theme.borderRadius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.large,
    },
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    description: {
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border.medium,
    },
    paginationDotActive: {
      width: 24,
      backgroundColor: theme.colors.primary[400],
    },
    buttonContainer: {
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xl,
    },
  });
  
  const onboardingSlides: OnboardingSlide[] = [
    {
      id: 1,
      icon: 'wallet-outline',
      title: 'Welcome to Rabovel',
      description: 'Your all-in-one platform for cryptocurrency trading, staking, and portfolio management.',
      gradient: theme.colors.gradient.primary,
    },
    {
      id: 2,
      icon: 'trending-up-outline',
      title: 'Track Markets',
      description: 'Stay updated with real-time market data, price charts, and market trends to make informed decisions.',
      gradient: theme.colors.gradient.secondary,
    },
    {
      id: 3,
      icon: 'lock-closed-outline',
      title: 'Earn Rewards',
      description: 'Stake your assets and earn passive income with competitive APY rates and flexible lock periods.',
      gradient: theme.colors.gradient.success,
    },
    {
      id: 4,
      icon: 'swap-horizontal-outline',
      title: 'Trade Seamlessly',
      description: 'Execute trades quickly and securely with our intuitive trading interface and advanced order types.',
      gradient: theme.colors.gradient.primary,
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const { completeOnboarding } = useAuth();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slideIndex !== currentSlide) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentSlide(slideIndex);
    }
  };

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      scrollViewRef.current?.scrollTo({
        x: nextSlide * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentSlide(nextSlide);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await completeOnboarding();
    (navigation as any).navigate('Auth', { screen: 'SignIn' });
  };

  const handleGetStarted = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await completeOnboarding();
    (navigation as any).navigate('Auth', { screen: 'SignIn' });
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentSlide(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={theme.colors.gradient.background}
        style={styles.gradient}
      >
        {/* Skip Button */}
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingSlides.map((slide, index) => (
            <View key={slide.id} style={styles.slide}>
              <View style={styles.slideContent}>
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={slide.gradient}
                    style={styles.iconGradient}
                  >
                    <Ionicons
                      name={slide.icon}
                      size={64}
                      color={theme.colors.text.primary}
                    />
                  </LinearGradient>
                </View>

                {/* Title */}
                <Text style={styles.title}>{slide.title}</Text>

                {/* Description */}
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {onboardingSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              style={[
                styles.paginationDot,
                currentSlide === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {currentSlide < onboardingSlides.length - 1 ? (
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="large"
              fullWidth
            />
          ) : (
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              fullWidth
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

