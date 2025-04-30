import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { registrationApi } from '../services/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  gray: '#757575',
  lightGray: '#e1e1e1',
};

export default function RegistrationListScreen({ navigation }) {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'unique'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('both'); // 'email', 'phone', 'both'
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [uniqueRegistrations, setUniqueRegistrations] = useState(0);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await registrationApi.getRegistrations();
      
      // Debug: Log the first item to see its structure
      if (data && data.length > 0) {
        console.log('Sample registration data:', JSON.stringify(data[0], null, 2));
      }
          
      setTotalRegistrations(data.length);
      
      // Calculate unique registrations (by email)
      const uniqueEmails = new Set(
        data
          .filter(item => item && item.email) // Make sure item and email exist
          .map(item => item.email.toLowerCase())
      );
      setUniqueRegistrations(uniqueEmails.size);
      
      // Update the registrations state
      setRegistrations(data);
      
      // Apply filters after setting the registrations
      applyFilters(data, filterMode, searchQuery, searchField);
      
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      setError('Failed to load registrations. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to apply all filters
  const applyFilters = (data, mode, query, field) => {
    // First apply uniqueness filter if needed
    let result = [...data];
    
    if (mode === 'unique') {
      // Get only unique registrations by email (keeping the most recent one)
      const emailMap = new Map();
      
      // Sort by datetime_registered in descending order (newest first)
      const sortedData = [...data].sort((a, b) => 
        new Date(b.datetime_registered || b.registration_date) - 
        new Date(a.datetime_registered || a.registration_date)
      );
      
      // Keep only the first (most recent) registration for each email
      sortedData.forEach(item => {
        if (!emailMap.has(item.email.toLowerCase())) {
          emailMap.set(item.email.toLowerCase(), item);
        }
      });
      
      result = Array.from(emailMap.values());
    }
    
    // Then apply search filter if query exists
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(item => {
        if (field === 'email' || field === 'both') {
          // Check multiple possible email field names
          const email = item.email || item.registrant_email || item.user_email || '';
          if (email.toLowerCase().includes(lowercaseQuery)) {
            return true;
          }
        }
        
        if (field === 'phone' || field === 'both') {
          if (item.phone && item.phone.toLowerCase().includes(lowercaseQuery)) {
            return true;
          }
        }
        
        return false;
      });
    }
    
    setFilteredRegistrations(result);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    applyFilters(registrations, filterMode, searchQuery, searchField);
  }, [filterMode, searchQuery, searchField]);

  // Add this useEffect to monitor state changes
  useEffect(() => {
    console.log('totalRegistrations state updated:', totalRegistrations);
  }, [totalRegistrations]);

  useEffect(() => {
    console.log('registrations state updated, length:', registrations.length);
  }, [registrations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRegistrations();
  };

  const toggleFilterMode = () => {
    setFilterMode(filterMode === 'all' ? 'unique' : 'all');
  };

  const toggleSearchField = () => {
    // Cycle through search field options: both -> email -> phone -> both
    if (searchField === 'both') {
      setSearchField('email');
    } else if (searchField === 'email') {
      setSearchField('phone');
    } else {
      setSearchField('both');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderItem = ({ item }) => {
    // Try to get email from different possible field names
    const email = item.email || item.registrant_email || item.user_email || 'N/A';
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('RegistrationDetails', { registrationId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Registration #{item.id}</Text>
          <Text style={styles.dateText}>
            {(item.datetime_registered || item.registration_date) 
              ? new Date(item.datetime_registered || item.registration_date).toLocaleDateString() 
              : 'No date'}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.infoText}>
            Name: {item.first_name || ''} {item.middle_name || ''} {item.last_name || ''}
          </Text>
          <Text style={styles.infoText}>Email: {email}</Text>
          <Text style={styles.infoText}>Phone: {item.phone || 'N/A'}</Text>
          <Text style={styles.infoText}>
            Location: {item.city || 'N/A'}, {item.state || 'N/A'}
          </Text>
          <Text style={styles.infoText}>
            Registered: {
              (item.datetime_registered || item.registration_date)
                ? new Date(item.datetime_registered || item.registration_date).toLocaleDateString() + ' ' + 
                  new Date(item.datetime_registered || item.registration_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                : 'N/A'
            }
          </Text>
        </View>
        <View style={styles.cardFooter}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => navigation.navigate('RegistrationDetails', { registrationId: item.id })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.secondaryBlue} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.secondaryBlue} />
        <Text style={styles.loadingText}>Loading registrations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.secondaryBlue} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRegistrations}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Stats Bar */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>

            <Text style={styles.statValue}>
              {totalRegistrations !== undefined ? totalRegistrations : 'Loading...'}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>

            <Text style={styles.statValue}>
              {uniqueRegistrations !== undefined ? uniqueRegistrations : 'Loading...'}
            </Text>
            <Text style={styles.statLabel}>Unique</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>

            <Text style={styles.statValue}>
              {filteredRegistrations ? filteredRegistrations.length : 0}
            </Text>
            <Text style={styles.statLabel}>Filtered</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search by ${searchField === 'both' ? 'email or phone' : searchField}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color={COLORS.gray} />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={styles.searchFieldButton} 
            onPress={toggleSearchField}
          >
            <MaterialIcons 
              name={searchField === 'email' ? 'email' : searchField === 'phone' ? 'phone' : 'filter-list'} 
              size={20} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Filter Toggle */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>
            Showing: {filterMode === 'all' ? 'All Registrations' : 'Unique Emails Only'}
          </Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={toggleFilterMode}
          >
            <Text style={styles.filterButtonText}>
              {filterMode === 'all' ? 'Show Unique Only' : 'Show All'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredRegistrations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.secondaryBlue]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color={COLORS.secondaryBlue} />
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'No registrations match your search criteria' 
                  : 'No registrations found'}
              </Text>
            </View>
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryBlue,
    padding: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.lightBlue,
    marginTop: 2,
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: COLORS.secondaryBlue,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: COLORS.textDark,
  },
  clearButton: {
    padding: 4,
  },
  searchFieldButton: {
    backgroundColor: COLORS.secondaryBlue,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
  },
  filterLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    flex: 1,
  },
  filterButton: {
    backgroundColor: COLORS.secondaryBlue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  filterButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Add extra padding at the bottom
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textDark,
    opacity: 0.7,
  },
  cardBody: {
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightBlue,
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: COLORS.secondaryBlue,
    fontWeight: '600',
    marginRight: 4,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
  },
});
