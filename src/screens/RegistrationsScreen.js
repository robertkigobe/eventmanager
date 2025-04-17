import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { registrationService } from '../services/registrationService';

const RegistrationsScreen = ({ navigation }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRegistrations = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const data = await registrationService.getRegistrations(pageNum);
      
      if (refresh || pageNum === 1) {
        setRegistrations(data.items);
      } else {
        setRegistrations(prev => [...prev, ...data.items]);
      }
      
      setHasMore(data.items.length > 0 && data.total > pageNum * data.per_page);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError('Failed to load registrations. Please try again.');
      Alert.alert('Error', 'Failed to load registrations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleRefresh = () => {
    fetchRegistrations(1, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      fetchRegistrations(page + 1);
    }
  };

  const handleRegistrationPress = (registration) => {
    navigation.navigate('RegistrationDetails', { registrationId: registration.id });
  };

  const renderRegistrationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.registrationItem}
      onPress={() => handleRegistrationPress(item)}
    >
      <Text style={styles.teamName}>{item.team_name}</Text>
      <Text style={styles.contactInfo}>{item.contact_name} • {item.contact_email}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.registrantCount}>
          {item.registrants.length} Registrant{item.registrants.length !== 1 ? 's' : ''}
        </Text>
        <Text style={[
          styles.paymentStatus, 
          { color: item.payment_status === 'paid' ? '#4CAF50' : '#FF9800' }
        ]}>
          {item.payment_status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing && registrations.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={registrations}
        renderItem={renderRegistrationItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          hasMore && !refreshing ? (
            <ActivityIndicator style={styles.loadingMore} size="small" color="#3498db" />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No registrations found</Text>
            </View>
          ) : null
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateRegistration')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  listContent: {
    padding: 16,
  },
  registrationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registrantCount: {
    fontSize: 14,
    color: '#3498db',
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingMore: {
    marginVertical: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RegistrationsScreen;
