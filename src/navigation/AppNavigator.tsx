import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { SplashScreen } from '../components/SplashScreen';
import { TabNavigator } from './TabNavigator';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { StakeDetailScreen } from '../screens/StakeDetailScreen';
import { TradingDetailScreen } from '../screens/TradingDetailScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { CurrencySelectionScreen } from '../screens/CurrencySelectionScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { KYCScreen } from '../screens/KYCScreen';
import { DepositScreen } from '../screens/DepositScreen';
import { WithdrawScreen } from '../screens/WithdrawScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppStack.Screen name="MainTabs" component={TabNavigator} />
      <AppStack.Screen name="StakeDetail" component={StakeDetailScreen} />
      <AppStack.Screen name="TradingDetail" component={TradingDetailScreen} />
      <AppStack.Screen name="Notifications" component={NotificationsScreen} />
      <AppStack.Screen name="Profile" component={ProfileScreen} />
      <AppStack.Screen name="Settings" component={SettingsScreen} />
      <AppStack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <AppStack.Screen name="CurrencySelection" component={CurrencySelectionScreen} />
      <AppStack.Screen name="About" component={AboutScreen} />
      <AppStack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <AppStack.Screen name="KYC" component={KYCScreen} />
      <AppStack.Screen name="Deposit" component={DepositScreen} />
      <AppStack.Screen name="Withdraw" component={WithdrawScreen} />
    </AppStack.Navigator>
  );
};

const RootNavigator = () => {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  // Determine initial route based on onboarding and auth state
  let initialRouteName = 'Onboarding';
  if (hasCompletedOnboarding) {
    initialRouteName = isAuthenticated ? 'Main' : 'Auth';
  }

  return (
    <RootStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};
