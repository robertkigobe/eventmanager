import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { registrationService } from '../services/registrationService';

const RegistrationDetailsScreen = ({ route, navigation }) => {
  const { registrationId } = route.params;
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistrationDetails();
  }, [registrationId]);

  const fetchRegistrationDetails = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getRegistration(registrationId);
      setRegistration(data);
      setError(null);
    } catch (err) {
      setError('Failed to load registration details');
      Alert.alert('Error', 'Failed to load registration details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRegistrant = () => {
    navigation.navigate('CreateRegistrant', { registrationId });
  };

  const handleEditRegistrant = (registrant) => {
    navigation.navigate('EditRegistrant', { registrantId: registrant.id });
  };

  const handleDeleteRegistrant = async (registrantId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this registrant?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await registrationService.deleteRegistrant(registrantId);
              // Refresh the registration details
              fetchRegistrationDetails();
              Alert.alert('Success', 'Registrant deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete registrant');
            }
          }
        }
      ]
    );
  };

  const renderRegistrantItem = ({ item }) => (
    <View style={styles.registrantItem}>
      <View style={styles.registrantInfo}>
        <Text style={styles.registrantName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.registrantDetail}>{item.email}</Text>
        {item.belt_rank && (
          <Text style={styles.registrantDetail}>Belt: {item.belt_rank}</Text>
        )}
        {item.division && (
          <Text style={styles.registrantDetail}>Division: {item.division}</Text>
        )}
      </View>
      <View style={styles.registrantActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditRegistrant(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteRegistrant(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error || !registration) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Registration not found'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchRegistrationDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.detailsContainer}>
        <View style={styles.registrationHeader}>
          <Text style={styles.teamName}>{registration.team_name}</Text>
          <View style={[
            styles.paymentStatusBadge, 
            { backgroundColor: registration.payment_status === 'paid' ? '#4CAF50' : '#FF9800' }
          ]}>
            <Text style={styles.paymentStatusText}>{registration.payment_status}</Text>
          </View>
        </View>
        <View style={styles.registrationDetails}>
          <Text style={styles.registrationDetail}>Registration ID: {registration.id}</Text>
          <Text style={styles.registrationDetail}>Date Registered: {registration.datetime_registered}</Text>
          <Text style={styles.registrationDetail}>Amount: ${parseFloat(registration.amount).toFixed(2)}</Text>
          <Text style={styles.registrationDetail}>Payment Method: {registration.payment_method}</Text>
          <Text style={styles.registrationDetail}>Payment Date: {registration.payment_date}</Text>
          <Text style={styles.registrationDetail}>Invoice: {registration.invoice}</Text>
          <Text style={styles.registrationDetail}>Order ID: {registration.order_id}</Text>
        </View>
        <View style={styles.registrationActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleAddRegistrant}
          >
            <Text style={styles.actionButtonText}>Add Registrant</Text>
          </TouchableOpacity>
        </View>
        <FlatList 
          data={registration.registrants}
          renderItem={renderRegistrantItem}
          keyExtractor={item => item.id.toString()}
          style={styles.registrantsList}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 20,
  },
  registrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentStatusBadge: {
    padding: 5,
    borderRadius: 5,
  },
  paymentStatusText: {
    color: '#fff',
    fontSize: 14,
  },
  registrationDetails: {
    marginBottom: 20,
  },
  registrationDetail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  registrationActions: {
    marginBottom: 20,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#2ecc71',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  registrantsList: {
    marginBottom: 20,
  },
  registrantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
  },
  registrantInfo: {
    flex: 1,
  },
  registrantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  registrantDetail: {
    fontSize: 16,
    color: '#333',
  },
  registrantActions: {
    flexDirection: 'row',
  },
});

export default RegistrationDetailsScreen;

