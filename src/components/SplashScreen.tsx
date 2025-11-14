import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const letterAnimations = useRef(
    'RABOVEL'.split('').map(() => ({
      translateY: new Animated.Value(50),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Start animations
    const animations = [
      // Fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Scale animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Rotate animation (subtle)
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ];

    // Letter animations (staggered)
    const letterAnims = letterAnimations.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 600,
          delay: index * 100,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
    });

    // Start all animations
    Animated.parallel([
      ...animations,
      ...letterAnims,
    ]).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
    },
    gradientContainer: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    letterContainer: {
      overflow: 'hidden',
    },
    letter: {
      fontSize: 72,
      fontWeight: '800',
      color: theme.colors.primary[400],
      textShadowColor: `${theme.colors.primary[400]}40`,
      textShadowOffset: { width: 0, height: 4 },
      textShadowRadius: 12,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text.secondary,
      letterSpacing: 4,
      marginTop: 16,
    },
    glowContainer: {
      position: 'absolute',
      width: width * 1.5,
      height: width * 1.5,
      borderRadius: width * 0.75,
      backgroundColor: theme.colors.primary[400],
      opacity: 0.1,
    },
  });

  return (
    <View style={styles.container}>
      {/* Animated background gradient */}
      <Animated.View
        style={[
          styles.gradientContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={[
            theme.colors.background.primary,
            theme.colors.background.secondary || theme.colors.background.primary,
            theme.colors.background.primary,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Glowing orb effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.2],
                }),
              },
            ],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
          },
        ]}
      />

      {/* Logo with animated letters */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolate },
            ],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.logoContainer}>
          {'RABOVEL'.split('').map((letter, index) => (
            <Animated.View
              key={index}
              style={[
                styles.letterContainer,
                {
                  transform: [
                    {
                      translateY: letterAnimations[index].translateY,
                    },
                  ],
                  opacity: letterAnimations[index].opacity,
                },
              ]}
            >
              <Text style={styles.letter}>{letter}</Text>
            </Animated.View>
          ))}
        </View>
        
        {/* Subtitle */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          STAKING PLATFORM
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

