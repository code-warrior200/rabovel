import React, { useMemo } from 'react';
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
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '../types';
import type { Theme } from '../context/ThemeContext';

const getNotificationIcon = (type: Notification['type']): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'staking':
      return 'lock-closed-outline';
    case 'trading':
      return 'swap-horizontal-outline';
    case 'market':
      return 'trending-up-outline';
    case 'success':
      return 'checkmark-circle-outline';
    case 'warning':
      return 'warning-outline';
    case 'error':
      return 'close-circle-outline';
    default:
      return 'information-circle-outline';
  }
};

const getNotificationColor = (type: Notification['type'], theme: Theme): string => {
  switch (type) {
    case 'staking':
      return theme.colors.primary[400];
    case 'trading':
      return theme.colors.secondary[400];
    case 'market':
      return theme.colors.info.main;
    case 'success':
      return theme.colors.success.main;
    case 'warning':
      return theme.colors.warning.main;
    case 'error':
      return theme.colors.error.main;
    default:
      return theme.colors.text.secondary;
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDelete,
}) => {
  const { theme } = useTheme();
  const iconName = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type, theme);

  const styles = StyleSheet.create({
    notificationItem: {
      padding: theme.spacing.md,
    },
    unreadNotification: {
      backgroundColor: `${theme.colors.primary[400]}10`,
    },
    notificationContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    notificationText: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    notificationTitle: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.text.primary,
      flex: 1,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary[400],
      marginLeft: theme.spacing.xs,
    },
    notificationMessage: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      lineHeight: 20,
    },
    notificationTime: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    },
    deleteButton: {
      padding: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification,
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.notificationText}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.notificationTime}>
            {formatTimeAgo(notification.timestamp)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="close-outline"
            size={20}
            color={theme.colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const NotificationsScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const navigation = useNavigation();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  } = useApp();

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      // Unread first, then by timestamp
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [notifications]);

  const handleNotificationPress = (notification: Notification) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Could navigate to related screen if actionUrl or relatedAssetId exists
  };

  const handleDeleteNotification = (notificationId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearNotification(notificationId);
  };

  const handleMarkAllAsRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    markAllAsRead();
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllNotifications();
          },
        },
      ]
    );
  };

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
      marginBottom: theme.spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
      marginTop: 4,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    actionButton: {
      flex: 1,
    },
    notificationsList: {
      gap: theme.spacing.sm,
    },
    notificationCard: {
      padding: 0,
      marginBottom: theme.spacing.sm,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing['4xl'],
    },
    emptyIconContainer: {
      marginBottom: theme.spacing.lg,
    },
    emptyIcon: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    emptyMessage: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      maxWidth: 280,
    },
  });

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
          <View style={styles.headerContent}>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.subtitle}>
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <View style={styles.actionsContainer}>
            {unreadCount > 0 && (
              <Button
                title="Mark All as Read"
                onPress={handleMarkAllAsRead}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
            )}
            <Button
              title="Clear All"
              onPress={handleClearAll}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          </View>
        )}

        {/* Notifications List */}
        {sortedNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={theme.colors.gradient.primary}
                style={styles.emptyIcon}
              >
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color={theme.colors.text.primary}
                />
              </LinearGradient>
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyMessage}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {sortedNotifications.map((notification) => (
              <Card key={notification.id} style={styles.notificationCard}>
                <NotificationItem
                  notification={notification}
                  onPress={() => handleNotificationPress(notification)}
                  onDelete={() => handleDeleteNotification(notification.id)}
                />
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

