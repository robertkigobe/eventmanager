import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registrationApi } from '../services/api';

export default function MyRegistrationsScreen({ navigation }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    
    // Refresh registrations when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRegistrations();
    });
    
    return unsubscribe;
  }, [navigation]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationApi.getRegistrations();
      // Filter out any items without an id
      const validData = data.filter(item => item && item.id);
      setRegistrations(validData);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      Alert.alert('Error', 'Failed to load registrations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Define the onRefresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchRegistrations();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003a70" />
        <Text style={styles.loadingText}>Loading registrations...</Text>
      </View>
    );
  }

  if (registrations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>No registrations found</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderRegistrationItem = ({ item }) => {
    // Add safety checks for item properties
    if (!item || !item.id) return null;
    
    return (
      <TouchableOpacity
        style={styles.registrationCard}
        onPress={() => navigation.navigate('RegistrationDetails', { registrationId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.registrationId}>Registration #{item.id}</Text>
          <Text style={styles.registrationDate}>{formatDate(item.datetime_registered)}</Text>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={18} color="#0077c8" />
            <Text style={styles.infoText}>
              {item.registrants ? item.registrants.length : 0} Registrant(s)
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={18} color="#0077c8" />
            <Text style={styles.infoText}>{item.email || 'No email provided'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="cash" size={18} color="#0077c8" />
            <Text style={styles.infoText}>
              ${item.amount ? parseFloat(item.amount).toFixed(2) : '0.00'}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusText,
                item.payment_status === 'Completed'
                  ? styles.statusCompleted
                  : styles.statusPending,
              ]}
            >
              {item.payment_status || 'Pending'}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={18} color="#0077c8" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrations</Text>
      
      <FlatList
        data={registrations}
        renderItem={renderRegistrationItem}
        keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
  messageText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003a70',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  registrationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  registrationId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003a70',
  },
  registrationDate: {
    fontSize: 14,
    color: '#333333',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#333333',
    marginLeft: 8,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    paddingTop: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#0077c8',
    marginRight: 4,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#003a70',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  signInButton: {
    backgroundColor: '#003a70',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#0077c8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
