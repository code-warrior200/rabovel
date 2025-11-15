import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

export const ProfileScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const navigation = useNavigation();
  const { user, signOut, updateUser, isLoading: authLoading } = useAuth();
  const { portfolio, walletBalance } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    placeholder: {
      width: 40,
    },
    profileCard: {
      marginBottom: theme.spacing.lg,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      marginRight: theme.spacing.md,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    },
    avatarText: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    editButtonText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.primary[400],
      fontWeight: theme.typography.fontWeight.medium,
      marginLeft: 4,
    },
    editContainer: {
      width: '100%',
    },
    nameInput: {
      marginBottom: theme.spacing.sm,
    },
    editActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    saveButton: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: `${theme.colors.success.main}20`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: `${theme.colors.error.main}20`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      flex: 1,
      padding: theme.spacing.md,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    menuSection: {
      marginBottom: theme.spacing.lg,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.card,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: `${theme.colors.primary[400]}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    menuItemText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
    },
    signOutButton: {
      marginTop: theme.spacing.md,
    },
  });

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(true);
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (editedName.trim() && user) {
      updateUser({ ...user, name: editedName.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditedName(user?.name || '');
    setIsEditing(false);
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You will need to sign in again to access your account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSigningOut(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await signOut();
              // Navigation will be handled automatically by AppNavigator
              // when isAuthenticated becomes false
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Sign out error:', error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                'Error',
                'Failed to sign out. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  const profileMenuItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        (navigation as any).navigate('Notifications');
      },
    },
    {
      id: 'kyc',
      title: 'KYC Verification',
      icon: 'shield-checkmark-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        (navigation as any).navigate('KYC');
      },
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Security', 'Security settings coming soon');
      },
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        (navigation as any).navigate('Settings');
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        (navigation as any).navigate('HelpSupport');
      },
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        (navigation as any).navigate('About');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.profileInfo}>
              {isEditing ? (
                <View style={styles.editContainer}>
                  <Input
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    style={styles.nameInput}
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      onPress={handleSave}
                      style={styles.saveButton}
                    >
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={theme.colors.success.main}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancel}
                      style={styles.cancelButton}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={theme.colors.error.main}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.userName}>{user?.name || 'User'}</Text>
                  <Text style={styles.userEmail}>{user?.email || ''}</Text>
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={styles.editButton}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={16}
                      color={theme.colors.primary[400]}
                    />
                    <Text style={styles.editButtonText}>Edit Name</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Card>

        {/* Account Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Portfolio Value</Text>
            <Text style={styles.statValue}>
              {formatCurrency(portfolio?.totalValue || 0)}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Wallet Balance</Text>
            <Text style={styles.statValue}>
              {formatCurrency(walletBalance)}
            </Text>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {profileMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={theme.colors.primary[400]}
                  />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="large"
          fullWidth
          style={styles.signOutButton}
          disabled={isSigningOut || authLoading}
          loading={isSigningOut || authLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

