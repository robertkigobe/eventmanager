import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Share,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { registrationApi } from '../services/api';
import colors from '../constants/colors';

export default function RegistrationDetailsScreen({ route, navigation }) {
  const { registrationId } = route.params;
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrationDetails();
  }, []);

  const fetchRegistrationDetails = async () => {
    try {
      setLoading(true);
      const data = await registrationApi.getRegistration(registrationId);
      setRegistration(data);
    } catch (error) {
      console.error('Error fetching registration details:', error);
      Alert.alert('Error', 'Failed to load registration details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    if (!registration) return;
    
    try {
      const registrantNames = registration.registrants
        .map(r => `${r.first_name} ${r.last_name}`)
        .join(', ');
      
      await Share.share({
        message: `BBNAC 2025 Registration #${registration.id}\n\nRegistered: ${formatDate(registration.datetime_registered)}\nRegistrants: ${registrantNames}\nAmount: $${parseFloat(registration.amount).toFixed(2)}\nStatus: ${registration.payment_status || 'Pending'}`,
        title: 'BBNAC 2025 Registration Details',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share registration details');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text style={styles.loadingText}>Loading registration details...</Text>
      </View>
    );
  }

  if (!registration) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={60} color={colors.primaryBlue} />
        <Text style={styles.errorText}>Registration not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Registration #{registration.id}</Text>
          <Text style={styles.date}>
            Registered on {formatDate(registration.datetime_registered)}
          </Text>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            registration.payment_status === 'Completed'
              ? styles.statusCompleted
              : styles.statusPending,
          ]}
        >
          {registration.payment_status || 'Pending'}
        </Text>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{registration.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{registration.phone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{registration.address}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>City:</Text>
          <Text style={styles.infoValue}>{registration.city}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>State/Province:</Text>
          <Text style={styles.infoValue}>{registration.state}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Postal Code:</Text>
          <Text style={styles.infoValue}>{registration.postal_code}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Country:</Text>
          <Text style={styles.infoValue}>{registration.country}</Text>
        </View>
      </View>

      {/* Registrants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registrants</Text>
        
        {registration.registrants && registration.registrants.map((registrant, index) => (
          <View key={index} style={styles.registrantCard}>
            <Text style={styles.registrantTitle}>
              {registrant.first_name} {registrant.middle_initial ? registrant.middle_initial + '. ' : ''}
              {registrant.last_name}
            </Text>
            
            {registrant.clan && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Clan:</Text>
                <Text style={styles.infoValue}>{registrant.clan}</Text>
              </View>
            )}
            
            {registrant.age && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>{registrant.age}</Text>
              </View>
            )}
            
            {registrant.tour && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tour:</Text>
                <Text style={styles.infoValue}>{registrant.tour}</Text>
              </View>
            )}
            
            {registrant.alternate_amount && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Alternate Amount:</Text>
                <Text style={styles.infoValue}>
                  ${parseFloat(registrant.alternate_amount).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Amount:</Text>
          <Text style={styles.infoValue}>
            ${parseFloat(registration.amount).toFixed(2)}
          </Text>
        </View>
        
        {registration.payment_method && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoValue}>{registration.payment_method}</Text>
          </View>
        )}
        
        {registration.payment_date && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Date:</Text>
            <Text style={styles.infoValue}>{registration.payment_date}</Text>
          </View>
        )}
        
        {registration.invoice && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice:</Text>
            <Text style={styles.infoValue}>{registration.invoice}</Text>
          </View>
        )}
        
        {registration.order_id && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>{registration.order_id}</Text>
          </View>
        )}
      </View>

      {/* Additional Information */}
      {registration.referral && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Referral:</Text>
            <Text style={styles.infoValue}>
              {registration.referral}
              {registration.referral === 'Other' && registration.other_referral
                ? ` (${registration.other_referral})`
                : ''}
            </Text>
          </View>
          
          {registration.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Notes:</Text>
              <Text style={styles.infoValue}>{registration.notes}</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textDark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  errorText: {
    fontSize: 18,
    color: colors.textDark,
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: colors.primaryBlue,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  date: {
    fontSize: 14,
    color: colors.lightBlue,
    marginTop: 5,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    padding: 15,
    backgroundColor: colors.white,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryBlue,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: 120,
    fontSize: 15,
    color: colors.textDark,
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
  },
  registrantCard: {
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  registrantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryBlue,
    marginBottom: 10,
  },
});
