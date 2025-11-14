import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { validateEmail } from '../utils/validation';

// Default credentials for demo/testing
export const DEFAULT_CREDENTIALS = {
  email: 'demo@rabovel.com',
  password: 'Demo1234',
};

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

// Helper functions for storage (fallback to AsyncStorage on web)
const setItemAsync = async (key: string, value: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

const getItemAsync = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};

const deleteItemAsync = async (key: string) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);

  // Check for existing auth and onboarding state on mount
  useEffect(() => {
    checkAuthState();
    checkOnboardingState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const token = await getItemAsync(AUTH_TOKEN_KEY);
      const userData = await getItemAsync(USER_DATA_KEY);

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkOnboardingState = async () => {
    try {
      const completed = await getItemAsync(ONBOARDING_COMPLETED_KEY);
      setHasCompletedOnboarding(completed === 'true');
    } catch (error) {
      console.error('Error checking onboarding state:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // Simulated API call with validation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Validate credentials (for demo, accept default credentials or any valid email)
      if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
        // Default demo user
        const userData: User = {
          id: '1',
          email: DEFAULT_CREDENTIALS.email,
          name: 'Demo User',
        };
        
        // Store auth token and user data
        await setItemAsync(AUTH_TOKEN_KEY, 'mock_token_' + Date.now());
        await setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
        
        setUser(userData);
      } else if (validateEmail(email) && password.length >= 6) {
        // Accept any valid email and password for testing
        const userData: User = {
          id: '1',
          email: email,
          name: email.split('@')[0],
        };
        
        // Store auth token and user data
        await setItemAsync(AUTH_TOKEN_KEY, 'mock_token_' + Date.now());
        await setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
        
        setUser(userData);
      } else {
        throw new Error(`Invalid email or password. Use ${DEFAULT_CREDENTIALS.email} / ${DEFAULT_CREDENTIALS.password} for demo access.`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please check your credentials.';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const userData: User = {
        id: '1',
        email: email,
        name: name,
      };

      // Store auth token and user data
      await setItemAsync(AUTH_TOKEN_KEY, 'mock_token_' + Date.now());
      await setItemAsync(USER_DATA_KEY, JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      // Remove auth token and user data
      await deleteItemAsync(AUTH_TOKEN_KEY);
      await deleteItemAsync(USER_DATA_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setItemAsync(USER_DATA_KEY, JSON.stringify(updatedUser));
  };

  const completeOnboarding = async () => {
    try {
      await setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        hasCompletedOnboarding,
        signIn,
        signUp,
        signOut,
        updateUser,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
