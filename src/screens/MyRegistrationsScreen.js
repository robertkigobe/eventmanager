import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Share,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import BarcodeComponent from '../components/BarcodeComponent';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  borderColor: '#cccccc',
  errorColor: '#d32f2f',
  successColor: '#388e3c',
  warningColor: '#f57c00',
  highlightYellow: '#ffd700',
};

// Mock data for registrations
const MOCK_REGISTRATIONS = [
  {
    id: 'reg-001',
    eventName: 'BBNAC Annual Convention 2025',
    registrantName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    registrationType: 'Full Conference',
    registrationDate: '2025-03-15',
    status: 'Confirmed',
    ticketNumber: 'BBNAC-2025-001',
  },
  {
    id: 'reg-002',
    eventName: 'Leadership Workshop',
    registrantName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    registrationType: 'Workshop Only',
    registrationDate: '2025-03-20',
    status: 'Pending',
    ticketNumber: 'BBNAC-WS-001',
  },
];

export default function MyRegistrationsScreen({ navigation }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showBarcode, setShowBarcode] = useState(false);

  // Fetch registrations (mock data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRegistrations(MOCK_REGISTRATIONS);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle sharing registration
  const shareRegistration = async (registration) => {
    try {
      await Share.share({
        message: `My registration for ${registration.eventName}\nTicket: ${registration.ticketNumber}\nStatus: ${registration.status}`,
        title: 'BBNAC Registration',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share registration');
    }
  };

  // Generate and save/share ticket with barcode
  const generateTicket = async (registration) => {
    setSelectedRegistration(registration);
    setShowBarcode(true);
  };

  // Render a registration item
  const renderRegistrationItem = ({ item }) => {
    const isConfirmed = item.status === 'Confirmed';
    
    return (
      <View style={styles.registrationCard}>
        <View style={styles.registrationHeader}>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: isConfirmed ? COLORS.successColor : COLORS.warningColor }
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.registrationDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={18} color={COLORS.secondaryBlue} />
            <Text style={styles.detailText}>{item.registrantName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={18} color={COLORS.secondaryBlue} />
            <Text style={styles.detailText}>Registered on {item.registrationDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="ticket-outline" size={18} color={COLORS.secondaryBlue} />
            <Text style={styles.detailText}>{item.ticketNumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="pricetag" size={18} color={COLORS.secondaryBlue} />
            <Text style={styles.detailText}>{item.registrationType}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => shareRegistration(item)}
          >
            <Ionicons name="share-social" size={20} color={COLORS.secondaryBlue} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => generateTicket(item)}
          >
            <MaterialCommunityIcons name="barcode" size={20} color={COLORS.secondaryBlue} />
            <Text style={styles.actionButtonText}>View Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {showBarcode ? (
        <BarcodeComponent 
          registration={selectedRegistration}
          onClose={() => setShowBarcode(false)}
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Registrations</Text>
            <Text style={styles.headerSubtitle}>View and manage your event registrations</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primaryBlue} />
              <Text style={styles.loadingText}>Loading your registrations...</Text>
            </View>
          ) : registrations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="ticket-confirmation" size={60} color={COLORS.borderColor} />
              <Text style={styles.emptyTitle}>No Registrations Found</Text>
              <Text style={styles.emptyText}>You haven't registered for any events yet.</Text>
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={registrations}
              renderItem={renderRegistrationItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightBlue,
  },
  listContainer: {
    padding: 16,
  },
  registrationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  registrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  registrationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: COLORS.textDark,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionButtonText: {
    color: COLORS.secondaryBlue,
    marginLeft: 4,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 24,
  },
  registerButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  registerButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
