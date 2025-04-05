import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

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
};

// Dummy data for registered attendees
const DUMMY_ATTENDEES = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    registrationType: 'Full Convention',
    checkedIn: false,
    checkInTime: null,
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    registrationType: 'Day Pass - Thursday',
    checkedIn: false,
    checkInTime: null,
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'mbrown@example.com',
    registrationType: 'Full Convention',
    checkedIn: true,
    checkInTime: '2025-06-12T09:45:00',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    registrationType: 'Virtual Attendance',
    checkedIn: false,
    checkInTime: null,
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'rwilson@example.com',
    registrationType: 'Day Pass - Friday',
    checkedIn: false,
    checkInTime: null,
  },
];

export default function CheckinScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState(DUMMY_ATTENDEES);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckedIn, setShowCheckedIn] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);

  // Filter attendees based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAttendees(showCheckedIn ? attendees : attendees.filter(a => !a.checkedIn));
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = attendees.filter(
        attendee => 
          (attendee.firstName.toLowerCase().includes(query) ||
          attendee.lastName.toLowerCase().includes(query) ||
          attendee.email.toLowerCase().includes(query)) &&
          (showCheckedIn || !attendee.checkedIn)
      );
      setFilteredAttendees(filtered);
    }
  }, [searchQuery, attendees, showCheckedIn]);

  // Handle check-in process
  const handleCheckIn = (attendee) => {
    if (attendee.checkedIn) {
      Alert.alert(
        "Already Checked In",
        `${attendee.firstName} ${attendee.lastName} has already been checked in at ${new Date(attendee.checkInTime).toLocaleString()}`,
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const updatedAttendees = attendees.map(a => 
        a.id === attendee.id 
          ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() } 
          : a
      );
      
      setAttendees(updatedAttendees);
      setIsLoading(false);
      
      Alert.alert(
        "Check-in Successful",
        `${attendee.firstName} ${attendee.lastName} has been checked in successfully.`,
        [{ text: "OK" }]
      );
    }, 1000);
  };

  // Handle viewing attendee details
  const handleViewDetails = (attendee) => {
    Alert.alert(
      `${attendee.firstName} ${attendee.lastName}`,
      `Email: ${attendee.email}\nRegistration Type: ${attendee.registrationType}\nStatus: ${attendee.checkedIn ? 'Checked In' : 'Not Checked In'}${attendee.checkedIn ? '\nCheck-in Time: ' + new Date(attendee.checkInTime).toLocaleString() : ''}`,
      [{ text: "Close" }]
    );
  };

  // Handle generating QR code
  const handleGenerateQR = (attendee) => {
    setSelectedAttendee(attendee);
    setQrModalVisible(true);
  };

  // Create QR code data
  const generateQRData = (attendee) => {
    // Create a JSON object with attendee data
    const qrData = {
      id: attendee.id,
      name: `${attendee.firstName} ${attendee.lastName}`,
      email: attendee.email,
      registrationType: attendee.registrationType,
      timestamp: new Date().toISOString()
    };
    
    // Convert to JSON string
    return JSON.stringify(qrData);
  };

  // Render each attendee item
  const renderAttendeeItem = ({ item }) => (
    <View style={styles.attendeeItem}>
      <View style={styles.attendeeInfo}>
        <Text style={styles.attendeeName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.attendeeEmail}>{item.email}</Text>
        <Text style={styles.attendeeType}>{item.registrationType}</Text>
        {item.checkedIn && (
          <View style={styles.checkedInBadge}>
            <Text style={styles.checkedInText}>Checked In</Text>
          </View>
        )}
      </View>
      <View style={styles.attendeeActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleViewDetails(item)}
        >
          <Ionicons name="information-circle-outline" size={24} color={COLORS.secondaryBlue} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleGenerateQR(item)}
        >
          <Ionicons name="qr-code-outline" size={24} color={COLORS.secondaryBlue} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            item.checkedIn ? styles.disabledButton : null
          ]}
          onPress={() => handleCheckIn(item)}
          disabled={item.checkedIn}
        >
          <Ionicons 
            name={item.checkedIn ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={item.checkedIn ? COLORS.successColor : COLORS.primaryBlue} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendee Check-in</Text>
        <Text style={styles.headerSubtitle}>BBNAC Convention 2025</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textDark} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textDark} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowCheckedIn(!showCheckedIn)}
          >
            <Text style={styles.filterButtonText}>
              {showCheckedIn ? "Hide Checked In" : "Show All"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
          <Text style={styles.loadingText}>Processing check-in...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultsText}>
            {filteredAttendees.length} {filteredAttendees.length === 1 ? 'attendee' : 'attendees'} found
          </Text>
          
          {filteredAttendees.length > 0 ? (
            <FlatList
              data={filteredAttendees}
              renderItem={renderAttendeeItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="person-outline" size={60} color={COLORS.borderColor} />
              <Text style={styles.emptyText}>No attendees found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
            </View>
          )}
        </>
      )}

      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            <Text style={styles.qrModalTitle}>Attendee QR Code</Text>
            
            {selectedAttendee && (
              <>
                <Text style={styles.qrAttendeeName}>
                  {selectedAttendee.firstName} {selectedAttendee.lastName}
                </Text>
                <Text style={styles.qrAttendeeEmail}>{selectedAttendee.email}</Text>
                <Text style={styles.qrAttendeeType}>{selectedAttendee.registrationType}</Text>
                
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={generateQRData(selectedAttendee)}
                    size={200}
                    color={COLORS.primaryBlue}
                    backgroundColor={COLORS.white}
                  />
                </View>
                
                <Text style={styles.qrInstructions}>
                  Scan this code at the registration desk for quick check-in
                </Text>
              </>
            )}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightBlue,
    marginTop: 5,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: COLORS.lightBlue,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.secondaryBlue,
    borderRadius: 5,
  },
  filterButtonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  resultsText: {
    padding: 15,
    fontSize: 14,
    color: COLORS.textDark,
    fontStyle: 'italic',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  attendeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 5,
  },
  attendeeEmail: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 5,
  },
  attendeeType: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    fontWeight: '500',
  },
  checkedInBadge: {
    backgroundColor: COLORS.successColor,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  checkedInText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  attendeeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textDark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 5,
    textAlign: 'center',
  },
  // QR Code Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrModalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 15,
    textAlign: 'center',
  },
  qrAttendeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  qrAttendeeEmail: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 5,
    textAlign: 'center',
  },
  qrAttendeeType: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCodeContainer: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: 20,
  },
  qrInstructions: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
