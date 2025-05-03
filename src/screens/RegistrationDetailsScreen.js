import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { registrationApi } from '../services/api';
import BarcodeComponent from '../components/BarcodeComponent';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  gray: '#757575',
  lightGray: '#e1e1e1',
  successColor: '#388e3c',
  warningColor: '#f57c00',
  errorColor: '#d32f2f',
};

export default function RegistrationDetailsScreen({ route, navigation }) {
  const { registrationId } = route.params;
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBarcode, setShowBarcode] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    fetchRegistrationDetails();
  }, []);

  const fetchRegistrationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the correct endpoint for fetching registration details
      const data = await registrationApi.getRegistrant(registrationId);
      
      // Log the response for debugging
      console.log('Registration details:', JSON.stringify(data, null, 2));
      
      setRegistration(data);
    } catch (err) {
      console.error('Failed to fetch registration details:', err);
      setError('Failed to load registration details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return COLORS.gray;
    
    status = status.toLowerCase();
    if (status === 'confirmed' || status === 'paid' || status === 'completed') {
      return COLORS.successColor;
    } else if (status === 'pending' || status === 'in progress') {
      return COLORS.warningColor;
    } else if (status === 'cancelled' || status === 'failed') {
      return COLORS.errorColor;
    }
    return COLORS.gray;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const handleViewTicket = () => {
    if (!registration) return;
    
    // Create ticket data from registration
    const newTicketData = {
      eventName: "BBNAC Convention 2025",
      ticketNumber: `BBNAC-${registration.id}`,
      registrantName: `${registration.first_name} ${registration.middle_name || ''} ${registration.last_name}`.trim(),
      registrationType: registration.age_group || 'General',
      registrationDate: formatDate(registration.paymt_date || registration.registration_date),
      status: registration.status || 'Pending'
    };
    
    setTicketData(newTicketData);
    setShowBarcode(true);
  };

  const handleGenerateQRCode = () => {
    if (!registration) return;
    
    // Create QR code data from registration
    // You can customize what data goes into the QR code
    const qrData = {
      eventName: "BBNAC Convention 2025",
      ticketNumber: `BBNAC-${registration.id}`,
      registrantName: `${registration.first_name} ${registration.middle_name || ''} ${registration.last_name}`.trim(),
      registrationType: registration.age_group || 'General',
      registrationDate: formatDate(registration.paymt_date || registration.registration_date),
      status: registration.status || 'Pending',
      // Add any additional fields you want in the QR code
      email: registration.email,
      phone: registration.phone,
      clan: registration.clan
    };
    
    setShowBarcode(true);
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={fetchRegistrationDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
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

  if (showBarcode && ticketData) {
    return (
      <BarcodeComponent 
        registration={ticketData} 
        onClose={() => setShowBarcode(false)} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Registration Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.registrationId}>Registration #{registration.id}</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(registration.status) }
            ]}>
              <Text style={styles.statusText}>{registration.status || 'Pending'}</Text>
            </View>
          </View>
          
          <Text style={styles.registrationDate}>
            Registered: {formatDate(registration.registration_date || registration.paymt_date)}
          </Text>
        </View>
        
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>
              {registration.first_name} {registration.middle_name || ''} {registration.last_name}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{registration.email || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{registration.phone || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {registration.city || 'N/A'}, {registration.state || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age Group</Text>
            <Text style={styles.infoValue}>{registration.age_group || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Clan</Text>
            <Text style={styles.infoValue}>{registration.clan || 'N/A'}</Text>
          </View>
        </View>
        
        {/* Payment Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method</Text>
            <Text style={styles.infoValue}>{registration.pymt_method || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Date</Text>
            <Text style={styles.infoValue}>{formatDate(registration.paymt_date)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Amount</Text>
            <Text style={styles.infoValue}>{formatCurrency(registration.amount)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rate</Text>
            <Text style={styles.infoValue}>{registration.rate || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>On Tab</Text>
            <Text style={styles.infoValue}>{registration.on_tab || 'N/A'}</Text>
          </View>
        </View>
        
        {/* Additional Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Check-in Status</Text>
            <View style={styles.checkInContainer}>
              <Text style={styles.infoValue}>{registration.checked_in || 'No'}</Text>
              {registration.checked_in === 'Yes' && (
                <Ionicons name="checkmark-circle" size={20} color={COLORS.successColor} style={styles.checkIcon} />
              )}
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Comments</Text>
            <Text style={styles.infoValue}>{registration.comments || 'No comments'}</Text>
          </View>
        </View>
        
        {/* Actions Section */}
        <View style={styles.actionsContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { flex: 1, marginRight: 8 }]}
              onPress={handleViewTicket}
            >
              <Ionicons name="qr-code-outline" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>View Ticket</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { flex: 1, marginLeft: 8, backgroundColor: COLORS.successColor }]}
              onPress={() => {
                // Handle paid status update
                Alert.alert(
                  'Mark as Paid',
                  'Are you sure you want to mark this registration as paid?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes, Mark as Paid',
                      onPress: async () => {
                        try {
                          setLoading(true);
                          await registrationApi.updateRegistrant(registrationId, {
                            ...registration,
                            status: 'Paid',
                            paymt_date: new Date().toISOString().split('T')[0]
                          });
                          
                          // Refresh registration details
                          fetchRegistrationDetails();
                          Alert.alert('Success', 'Registration marked as paid successfully');
                        } catch (error) {
                          console.error('Error updating payment status:', error);
                          Alert.alert('Error', 'Failed to update payment status');
                        } finally {
                          setLoading(false);
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <MaterialIcons name="payment" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Mark as Paid</Text>
            </TouchableOpacity>
          </View>
          
          
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  registrationId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  registrationDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  checkInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginLeft: 8,
  },
  actionsContainer: {
    padding: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: COLORS.secondaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
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
});
