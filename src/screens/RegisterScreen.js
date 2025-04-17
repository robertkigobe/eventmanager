import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registrationApi } from '../services/api';
import colors from '../constants/colors';

// Referral options
const REFERRAL_OPTIONS = [
  { label: 'Select an option', value: '' },
  { label: 'Friend or Family', value: 'Friend or Family' },
  { label: 'Social Media', value: 'Social Media' },
  { label: 'Email', value: 'Email' },
  { label: 'Website', value: 'Website' },
  { label: 'Previous Attendee', value: 'Previous Attendee' },
  { label: 'Other', value: 'Other' },
];

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showReferralDropdown, setShowReferralDropdown] = useState(false);
  const [registration, setRegistration] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    email: '',
    phone: '',
    referral: '',
    other_referral: '',
    amount: '',
    registrants: [
      {
        first_name: '',
        middle_initial: '',
        last_name: '',
        clan: '',
        age: '',
        tour: '',
        alternate_amount: '',
      },
    ],
  });

  // Add another registrant
  const addRegistrant = () => {
    setRegistration({
      ...registration,
      registrants: [
        ...registration.registrants,
        {
          first_name: '',
          middle_initial: '',
          last_name: '',
          clan: '',
          age: '',
          tour: '',
          alternate_amount: '',
        },
      ],
    });
  };

  // Remove a registrant
  const removeRegistrant = (index) => {
    if (registration.registrants.length > 1) {
      const updatedRegistrants = [...registration.registrants];
      updatedRegistrants.splice(index, 1);
      setRegistration({
        ...registration,
        registrants: updatedRegistrants,
      });
    } else {
      Alert.alert('Cannot Remove', 'You must have at least one registrant');
    }
  };

  // Update registration field
  const updateField = (field, value) => {
    setRegistration({
      ...registration,
      [field]: value,
    });
  };

  // Update registrant field
  const updateRegistrantField = (index, field, value) => {
    const updatedRegistrants = [...registration.registrants];
    updatedRegistrants[index] = {
      ...updatedRegistrants[index],
      [field]: value,
    };
    
    setRegistration({
      ...registration,
      registrants: updatedRegistrants,
    });
  };

  // Select referral option
  const selectReferralOption = (option) => {
    updateField('referral', option.value);
    setShowReferralDropdown(false);
  };

  // Submit registration
  const handleSubmit = async () => {
    // Validate form
    if (!registration.email || !registration.phone) {
      Alert.alert('Missing Information', 'Please provide your email and phone number');
      return;
    }
    
    // Validate registrants
    for (let i = 0; i < registration.registrants.length; i++) {
      const registrant = registration.registrants[i];
      if (!registrant.first_name || !registrant.last_name) {
        Alert.alert('Missing Information', `Please provide first and last name for Registrant ${i + 1}`);
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Format data for API
      const formattedData = {
        ...registration,
        amount: parseFloat(registration.amount) || 0,
        registrants: registration.registrants.map(reg => ({
          ...reg,
          alternate_amount: reg.alternate_amount ? parseFloat(reg.alternate_amount) : null,
        })),
      };
      
      // Submit to API
      const response = await registrationApi.createRegistration(formattedData);
      
      Alert.alert(
        'Registration Successful',
        'Your registration has been submitted successfully!',
        [
          {
            text: 'View My Registrations',
            onPress: () => navigation.navigate('MyRegistrations'),
          },
          {
            text: 'Return Home',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        'There was an error submitting your registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Render referral dropdown item
  const renderReferralItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => selectReferralOption(item)}
    >
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text style={styles.loadingText}>Submitting your registration...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>BBNAC 2025 Registration</Text>
      
      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={registration.address}
          onChangeText={(text) => updateField('address', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="City"
          value={registration.city}
          onChangeText={(text) => updateField('city', text)}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="State/Province"
            value={registration.state}
            onChangeText={(text) => updateField('state', text)}
          />
          
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Postal Code"
            value={registration.postal_code}
            onChangeText={(text) => updateField('postal_code', text)}
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={registration.country}
          onChangeText={(text) => updateField('country', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={registration.email}
          onChangeText={(text) => updateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={registration.phone}
          onChangeText={(text) => updateField('phone', text)}
          keyboardType="phone-pad"
        />
      </View>
      
      {/* Registrants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registrants</Text>
        
        {registration.registrants.map((registrant, index) => (
          <View key={index} style={styles.registrantContainer}>
            <View style={styles.registrantHeader}>
              <Text style={styles.registrantTitle}>Registrant {index + 1}</Text>
              {registration.registrants.length > 1 && (
                <TouchableOpacity onPress={() => removeRegistrant(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="First Name"
                value={registrant.first_name}
                onChangeText={(text) => updateRegistrantField(index, 'first_name', text)}
              />
              
              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="MI"
                value={registrant.middle_initial}
                onChangeText={(text) => updateRegistrantField(index, 'middle_initial', text)}
                maxLength={1}
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={registrant.last_name}
              onChangeText={(text) => updateRegistrantField(index, 'last_name', text)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Clan"
              value={registrant.clan}
              onChangeText={(text) => updateRegistrantField(index, 'clan', text)}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Age"
                value={registrant.age}
                onChangeText={(text) => updateRegistrantField(index, 'age', text)}
                keyboardType="numeric"
              />
              
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Tour (if applicable)"
                value={registrant.tour}
                onChangeText={(text) => updateRegistrantField(index, 'tour', text)}
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Alternate Amount (if applicable)"
              value={registrant.alternate_amount}
              onChangeText={(text) => updateRegistrantField(index, 'alternate_amount', text)}
              keyboardType="numeric"
            />
          </View>
        ))}
        
        <TouchableOpacity style={styles.addButton} onPress={addRegistrant}>
          <Text style={styles.addButtonText}>+ Add Another Registrant</Text>
        </TouchableOpacity>
      </View>
      
      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Registration Amount ($)"
          value={registration.amount}
          onChangeText={(text) => updateField('amount', text)}
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>How did you hear about us?</Text>
        
        {/* Simple Dropdown */}
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setShowReferralDropdown(!showReferralDropdown)}
        >
          <Text style={styles.dropdownButtonText}>
            {registration.referral ? 
              REFERRAL_OPTIONS.find(option => option.value === registration.referral)?.label : 
              'Select an option'}
          </Text>
          <Ionicons 
            name={showReferralDropdown ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={colors.textDark} 
          />
        </TouchableOpacity>
        
        {/* Dropdown Menu */}
        {showReferralDropdown && (
          <View style={styles.dropdownMenu}>
            {REFERRAL_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => selectReferralOption(option)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  registration.referral === option.value && styles.dropdownItemSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {registration.referral === 'Other' && (
          <TextInput
            style={styles.input}
            placeholder="Please specify"
            value={registration.other_referral}
            onChangeText={(text) => updateField('other_referral', text)}
          />
        )}
      </View>
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Registration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryBlue,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryBlue,
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  inputSmall: {
    width: '20%',
  },
  label: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 5,
    marginTop: 5,
  },
  // Dropdown styles
  dropdownButton: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.textDark,
  },
  dropdownMenu: {
    backgroundColor: colors.white,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.textDark,
  },
  dropdownItemSelected: {
    color: colors.secondaryBlue,
    fontWeight: 'bold',
  },
  registrantContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
  },
  registrantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  registrantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.secondaryBlue,
  },
  removeText: {
    color: '#d9534f',
    fontWeight: '500',
  },
  addButton: {
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondaryBlue,
    marginTop: 10,
  },
  addButtonText: {
    color: colors.secondaryBlue,
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 15,
    backgroundColor: colors.primaryBlue,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
