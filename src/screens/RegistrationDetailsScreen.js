import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { registrationApi } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
};

export default function RegistrationDetailsScreen({ route, navigation }) {
  const { registrationId } = route.params;
  const [registration, setRegistration] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch registration details
        const registrationData = await registrationApi.getRegistration(registrationId);
        setRegistration(registrationData);
        
        // Fetch registrants for this registration
        const registrantsData = await registrationApi.getRegistrants(registrationId);
        setRegistrants(registrantsData);
      } catch (err) {
        console.error('Failed to fetch registration details:', err);
        setError('Failed to load registration details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationDetails();
  }, [registrationId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.secondaryBlue} />
        <Text style={styles.loadingText}>Loading registration details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.secondaryBlue} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!registration) {
    return (
      <View style={styles.centered}>
        <Ionicons name="document-outline" size={48} color={COLORS.secondaryBlue} />
        <Text style={styles.errorText}>Registration not found</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{registration.event_name || 'Unnamed Event'}</Text>
        <Text style={styles.date}>
          Registered on: {new Date(registration.registration_date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{registration.status || 'Pending'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Event Date:</Text>
          <Text style={styles.detailValue}>
            {registration.event_date ? new Date(registration.event_date).toLocaleDateString() : 'Not specified'}
          </Text>
        </View>
        {/* Add more registration details as needed */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registrants ({registrants.length})</Text>
        {registrants.length === 0 ? (
          <Text style={styles.emptyText}>No registrants found</Text>
        ) : (
          registrants.map((registrant, index) => (
            <View key={registrant.id} style={styles.registrantCard}>
              <Text style={styles.registrantName}>
                {registrant.first_name} {registrant.last_name}
              </Text>
              <Text style={styles.registrantDetail}>Email: {registrant.email || 'N/A'}</Text>
              <Text style={styles.registrantDetail}>Phone: {registrant.phone || 'N/A'}</Text>
              {/* Add more registrant details as needed */}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textDark,
  },
  registrantCard: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  registrantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 8,
  },
  registrantDetail: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.secondaryBlue,
    borderRadius: 4,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textDark,
    fontStyle: 'italic',
  },
});
