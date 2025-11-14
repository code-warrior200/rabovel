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
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

type KYCStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

export const KYCScreen: React.FC = () => {
  const navigation = useNavigation();
  const { themeMode, theme } = useTheme();
  const [kycStatus, setKycStatus] = useState<KYCStatus>('not_started');
  const [documents, setDocuments] = useState<{
    idCard: string | null;
    selfie: string | null;
    proofOfAddress: string | null;
  }>({
    idCard: null,
    selfie: null,
    proofOfAddress: null,
  });

  const handlePickImage = async (type: 'idCard' | 'selfie' | 'proofOfAddress') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate image picker - in production, use expo-image-picker
    Alert.alert(
      'Upload Document',
      'Image picker functionality will be available after installing expo-image-picker package.',
      [
        {
          text: 'Simulate Upload',
          onPress: () => {
            setDocuments((prev) => ({
              ...prev,
              [type]: 'uploaded',
            }));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Document uploaded successfully!');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTakePhoto = async (type: 'idCard' | 'selfie' | 'proofOfAddress') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate camera - in production, use expo-image-picker
    Alert.alert(
      'Take Photo',
      'Camera functionality will be available after installing expo-image-picker package.',
      [
        {
          text: 'Simulate Photo',
          onPress: () => {
            setDocuments((prev) => ({
              ...prev,
              [type]: 'uploaded',
            }));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Photo captured successfully!');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleUploadDocument = (type: 'idCard' | 'selfie' | 'proofOfAddress') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Upload Document',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => handleTakePhoto(type),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => handlePickImage(type),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSubmitKYC = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!documents.idCard || !documents.selfie || !documents.proofOfAddress) {
      Alert.alert('Missing Documents', 'Please upload all required documents before submitting.');
      return;
    }

    Alert.alert(
      'Submit KYC',
      'Are you sure you want to submit your KYC verification? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => {
            setKycStatus('pending');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
              'KYC Submitted',
              'Your KYC verification has been submitted and is under review. You will be notified once the verification is complete.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const getStatusColor = (): string => {
    switch (kycStatus) {
      case 'verified':
        return theme.colors.success.main;
      case 'pending':
        return theme.colors.warning.main;
      case 'rejected':
        return theme.colors.error.main;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = (): string => {
    switch (kycStatus) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Started';
    }
  };

  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (kycStatus) {
      case 'verified':
        return 'checkmark-circle';
      case 'pending':
        return 'time-outline';
      case 'rejected':
        return 'close-circle';
      default:
        return 'document-outline';
    }
  };

  const requiredDocuments = [
    {
      id: 'idCard',
      title: 'Government ID',
      description: 'National ID, Passport, or Driver\'s License',
      icon: 'card-outline' as keyof typeof Ionicons.glyphMap,
      uploaded: !!documents.idCard,
    },
    {
      id: 'selfie',
      title: 'Selfie Photo',
      description: 'A clear photo of yourself holding your ID',
      icon: 'camera-outline' as keyof typeof Ionicons.glyphMap,
      uploaded: !!documents.selfie,
    },
    {
      id: 'proofOfAddress',
      title: 'Proof of Address',
      description: 'Utility bill or bank statement (not older than 3 months)',
      icon: 'home-outline' as keyof typeof Ionicons.glyphMap,
      uploaded: !!documents.proofOfAddress,
    },
  ];

  const allDocumentsUploaded = requiredDocuments.every((doc) => doc.uploaded);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      edges={['top']}
    >
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
            style={[styles.backButton, { backgroundColor: theme.colors.background.card }]}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>KYC Verification</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View
              style={[
                styles.statusIconContainer,
                { backgroundColor: `${getStatusColor()}20` },
              ]}
            >
              <Ionicons name={getStatusIcon()} size={32} color={getStatusColor()} />
            </View>
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: theme.colors.text.primary }]}>
                Verification Status
              </Text>
              <Text style={[styles.statusValue, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
          {kycStatus === 'pending' && (
            <Text style={[styles.statusDescription, { color: theme.colors.text.secondary }]}>
              Your documents are being reviewed. This process usually takes 1-3 business days.
            </Text>
          )}
          {kycStatus === 'rejected' && (
            <Text style={[styles.statusDescription, { color: theme.colors.error.main }]}>
              Your verification was rejected. Please check your documents and resubmit.
            </Text>
          )}
        </Card>

        {/* Information Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.colors.info.main}
            />
            <Text style={[styles.infoTitle, { color: theme.colors.text.primary }]}>
              Why KYC is Required
            </Text>
          </View>
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            Know Your Customer (KYC) verification is required to comply with financial regulations
            and ensure the security of your account. This helps us prevent fraud and protect your
            assets.
          </Text>
        </Card>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            Required Documents
          </Text>
          {requiredDocuments.map((doc) => (
            <Card key={doc.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View
                  style={[
                    styles.documentIconContainer,
                    {
                      backgroundColor: doc.uploaded
                        ? `${theme.colors.success.main}20`
                        : `${theme.colors.primary[400]}20`,
                    },
                  ]}
                >
                  <Ionicons
                    name={doc.icon}
                    size={24}
                    color={doc.uploaded ? theme.colors.success.main : theme.colors.primary[400]}
                  />
                </View>
                <View style={styles.documentInfo}>
                  <View style={styles.documentTitleRow}>
                    <Text style={[styles.documentTitle, { color: theme.colors.text.primary }]}>
                      {doc.title}
                    </Text>
                    {doc.uploaded && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={theme.colors.success.main}
                      />
                    )}
                  </View>
                  <Text style={[styles.documentDescription, { color: theme.colors.text.secondary }]}>
                    {doc.description}
                  </Text>
                </View>
              </View>
              {kycStatus === 'not_started' || kycStatus === 'rejected' ? (
                <Button
                  title={doc.uploaded ? 'Replace Document' : 'Upload Document'}
                  onPress={() => handleUploadDocument(doc.id as 'idCard' | 'selfie' | 'proofOfAddress')}
                  variant={doc.uploaded ? 'outline' : 'primary'}
                  size="small"
                  fullWidth
                  style={styles.uploadButton}
                />
              ) : null}
            </Card>
          ))}
        </View>

        {/* Submit Button */}
        {(kycStatus === 'not_started' || kycStatus === 'rejected') && (
          <Button
            title="Submit for Verification"
            onPress={handleSubmitKYC}
            variant="primary"
            size="large"
            fullWidth
            disabled={!allDocumentsUploaded}
            style={styles.submitButton}
          />
        )}

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Text style={[styles.helpText, { color: theme.colors.text.tertiary }]}>
            Need help? Contact support at support@rabovel.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  statusCard: {
    marginBottom: 16,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },
  infoCard: {
    marginBottom: 24,
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  documentCard: {
    marginBottom: 12,
    padding: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  documentDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  uploadButton: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  helpSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

