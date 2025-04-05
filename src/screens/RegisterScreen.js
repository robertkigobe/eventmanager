import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
};

// Simple Dropdown Component
const SimpleDropdown = ({ label, options, selectedValue, onValueChange, error }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Find the selected option's label
  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : 'Select an option';
  
  return (
    <View>
      <TouchableOpacity 
        style={[styles.dropdownButton, error && styles.inputError]} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{displayText}</Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textDark} />
      </TouchableOpacity>
      
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    selectedValue === item.value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                  {selectedValue === item.value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primaryBlue} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function RegisterScreen() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    church: '',
    position: '',
    registrationType: 'Full Convention',
    dietaryRestrictions: '',
    specialNeeds: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    agreeToTerms: false,
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Registration types with prices
  const registrationTypes = [
    { label: 'Full Convention ($299)', value: 'Full Convention' },
    { label: 'Day Pass - Thursday ($99)', value: 'Day Pass - Thursday' },
    { label: 'Day Pass - Friday ($99)', value: 'Day Pass - Friday' },
    { label: 'Day Pass - Saturday ($99)', value: 'Day Pass - Saturday' },
    { label: 'Virtual Attendance ($149)', value: 'Virtual Attendance' },
  ];

  // US States for dropdown
  const usStates = [
    { label: 'Select State', value: '' },
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    // Add all other states here
    { label: 'Wyoming', value: 'WY' },
  ];

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode', 
      'emergencyContactName', 'emergencyContactPhone'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      // Here you would typically send the data to your backend
    } else {
      console.log('Form has errors');
    }
  };

  // Input field component for reuse
  const FormField = ({ label, field, placeholder, keyboardType = 'default', multiline = false }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.textArea,
          errors[field] && styles.inputError
        ]}
        value={formData[field]}
        onChangeText={(text) => handleChange(field, text)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  // Success message after submission
  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color={COLORS.successColor} />
        <Text style={styles.successTitle}>Registration Successful!</Text>
        <Text style={styles.successText}>
          Thank you for registering for the BBNAC Convention 2025. You will receive a confirmation email shortly.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setIsSubmitted(false)}
        >
          <Text style={styles.buttonText}>Register Another Person</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Convention Registration</Text>
          <Text style={styles.subtitle}>Please fill out the form below to register for BBNAC Convention 2025</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <FormField 
              label="First Name" 
              field="firstName" 
              placeholder="Enter your first name" 
            />
            
            <FormField 
              label="Last Name" 
              field="lastName" 
              placeholder="Enter your last name" 
            />
            
            <FormField 
              label="Email" 
              field="email" 
              placeholder="Enter your email address" 
              keyboardType="email-address" 
            />
            
            <FormField 
              label="Phone" 
              field="phone" 
              placeholder="Enter your phone number" 
              keyboardType="phone-pad" 
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            
            <FormField 
              label="Street Address" 
              field="address" 
              placeholder="Enter your street address" 
            />
            
            <FormField 
              label="City" 
              field="city" 
              placeholder="Enter your city" 
            />
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>State</Text>
              <SimpleDropdown
                label="Select State"
                options={usStates}
                selectedValue={formData.state}
                onValueChange={(value) => handleChange('state', value)}
                error={errors.state}
              />
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
            </View>
            
            <FormField 
              label="Zip Code" 
              field="zipCode" 
              placeholder="Enter your zip code" 
              keyboardType="numeric" 
            />
            
            <FormField 
              label="Country" 
              field="country" 
              placeholder="Enter your country" 
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Church Information</Text>
            
            <FormField 
              label="Church Name" 
              field="church" 
              placeholder="Enter your church name" 
            />
            
            <FormField 
              label="Position/Role" 
              field="position" 
              placeholder="Enter your position or role" 
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Registration Details</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Registration Type</Text>
              <SimpleDropdown
                label="Select Registration Type"
                options={registrationTypes}
                selectedValue={formData.registrationType}
                onValueChange={(value) => handleChange('registrationType', value)}
              />
            </View>
            
            <FormField 
              label="Dietary Restrictions" 
              field="dietaryRestrictions" 
              placeholder="Enter any dietary restrictions" 
              multiline={true}
            />
            
            <FormField 
              label="Special Needs" 
              field="specialNeeds" 
              placeholder="Enter any special needs or accommodations" 
              multiline={true}
            />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            
            <FormField 
              label="Emergency Contact Name" 
              field="emergencyContactName" 
              placeholder="Enter emergency contact name" 
            />
            
            <FormField 
              label="Emergency Contact Phone" 
              field="emergencyContactPhone" 
              placeholder="Enter emergency contact phone" 
              keyboardType="phone-pad" 
            />
          </View>
          
          <View style={styles.termsContainer}>
            <Switch
              value={formData.agreeToTerms}
              onValueChange={(value) => handleChange('agreeToTerms', value)}
              trackColor={{ false: '#767577', true: COLORS.secondaryBlue }}
              thumbColor={formData.agreeToTerms ? COLORS.primaryBlue : '#f4f3f4'}
            />
            <Text style={styles.termsText}>
              I agree to the terms and conditions, including the cancellation policy and privacy policy.
            </Text>
          </View>
          {errors.agreeToTerms && (
            <Text style={[styles.errorText, { textAlign: 'center' }]}>
              {errors.agreeToTerms}
            </Text>
          )}
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit Registration</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Registration fees are non-refundable after May 1, 2025. Cancellations before this date will be subject to a $50 processing fee.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primaryBlue,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.primaryBlue,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.errorColor,
  },
  errorText: {
    color: COLORS.errorColor,
    fontSize: 14,
    marginTop: 5,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },
  button: {
    backgroundColor: COLORS.primaryBlue,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginVertical: 20,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  // New styles for custom dropdown
  dropdownButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 5,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 15,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBlue,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  selectedOptionText: {
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
  }
});

