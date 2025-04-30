import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  gray: '#757575',
  lightGray: '#e1e1e1',
  borderColor: '#cccccc',
  errorColor: '#d32f2f',
  successColor: '#388e3c',
  warningColor: '#f57c00',
  highlightYellow: '#ffd700',
};

export default function SurveyScreen() {
  const [responses, setResponses] = useState({
    overallExperience: null,
    expectationsMet: null,
    achievingObjectives: null,
    attendFuture: null,
    topicsRelevant: null,
    topicsOfInterest: '',
    futureTopic: '',
    suggestions: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (question, value) => {
    setResponses({
      ...responses,
      [question]: value
    });
  };

  const handleTextChange = (field, value) => {
    setResponses({
      ...responses,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    // Check if required fields are filled
    const requiredFields = ['overallExperience', 'expectationsMet', 'achievingObjectives', 'attendFuture', 'topicsRelevant'];
    const missingFields = requiredFields.filter(field => responses[field] === null);
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Incomplete Survey',
        'Please answer all required questions before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Here you would typically send the survey data to your backend
      // For now, we'll just simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      Alert.alert(
        'Survey Submitted',
        'Thank you for your feedback! Your responses have been recorded.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Submission Error',
        'There was an error submitting your survey. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderRadioOption = (question, option, label) => {
    const isSelected = responses[question] === option;
    
    return (
      <TouchableOpacity 
        style={styles.radioOption}
        onPress={() => handleOptionSelect(question, option)}
        activeOpacity={0.7}
      >
        <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
        <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={COLORS.primaryBlue} barStyle="light-content" />
        <View style={styles.centeredContainer}>
          <View style={styles.thankYouCard}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.successColor} />
            <Text style={styles.thankYouTitle}>Thank You!</Text>
            <Text style={styles.thankYouText}>
              Your feedback has been submitted successfully. We appreciate your input to help improve future conventions.
            </Text>
            <TouchableOpacity 
              style={styles.newSurveyButton}
              onPress={() => {
                setResponses({
                  overallExperience: null,
                  expectationsMet: null,
                  achievingObjectives: null,
                  attendFuture: null,
                  topicsRelevant: null,
                  topicsOfInterest: '',
                  futureTopic: '',
                  suggestions: ''
                });
                setSubmitted(false);
              }}
            >
              <Text style={styles.newSurveyButtonText}>Submit Another Response</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primaryBlue} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>POST-CONVENTION SURVEY</Text>
        <Text style={styles.headerSubtitle}>BBNAC 2025</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            Thank you for attending the 6th Biennial – Buganda Bumu North American Convention (BBNAC). 
            We would like to hear your impression of the various aspects of this convention, so that we can 
            continually improve the experience for all the participants.
          </Text>
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 1</Text>
          </View>
          <Text style={styles.questionText}>
            Overall, how would you rate your experience during Buganda Bumu convention?
          </Text>
          <View style={styles.optionsContainer}>
            {renderRadioOption('overallExperience', 'excellent', 'Excellent')}
            {renderRadioOption('overallExperience', 'good', 'Good')}
            {renderRadioOption('overallExperience', 'fair', 'Fair')}
            {renderRadioOption('overallExperience', 'poor', 'Poor')}
          </View>
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 2</Text>
          </View>
          <Text style={styles.questionText}>
            Overall, how would you rate this convention against your expectations?
          </Text>
          <View style={styles.optionsContainer}>
            {renderRadioOption('expectationsMet', 'exceeded', 'Has exceeded my expectations')}
            {renderRadioOption('expectationsMet', 'met', 'Met my expectations')}
            {renderRadioOption('expectationsMet', 'notMet', 'Has not met my expectations at all')}
          </View>
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 3</Text>
          </View>
          <Text style={styles.questionText}>
            Please indicate whether or not you agree that BBNAC is achieving its objectives of bringing together Baganda in North America to discuss cultural and socio-economic issues that concern them.
          </Text>
          <View style={styles.optionsContainer}>
            {renderRadioOption('achievingObjectives', 'stronglyAgree', 'Strongly Agree')}
            {renderRadioOption('achievingObjectives', 'agree', 'Agree')}
            {renderRadioOption('achievingObjectives', 'disagree', 'Disagree')}
            {renderRadioOption('achievingObjectives', 'stronglyDisagree', 'Strongly Disagree')}
          </View>
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 4</Text>
          </View>
          <Text style={styles.questionText}>
            Based on your experience at this convention, how likely are you to attend future Buganda Bumu conventions?
          </Text>
          <View style={styles.optionsContainer}>
            {renderRadioOption('attendFuture', 'veryLikely', 'Very Likely')}
            {renderRadioOption('attendFuture', 'likely', 'Likely')}
            {renderRadioOption('attendFuture', 'notLikely', 'Not Likely')}
          </View>
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 5</Text>
          </View>
          <Text style={styles.questionText}>
            Most of the topics discussed during this BBNAC were relevant and appropriate
          </Text>
          <View style={styles.optionsContainer}>
            {renderRadioOption('topicsRelevant', 'true', 'True')}
            {renderRadioOption('topicsRelevant', 'false', 'False')}
            {renderRadioOption('topicsRelevant', 'dontKnow', 'Don\'t know')}
          </View>
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 6</Text>
          </View>
          <Text style={styles.questionText}>
            What topics were of most interest to you?
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Enter your response here..."
            value={responses.topicsOfInterest}
            onChangeText={(text) => handleTextChange('topicsOfInterest', text)}
          />
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 7</Text>
          </View>
          <Text style={styles.questionText}>
            What other topics would you like to be discussed in future Buganda Bumu Conventions?
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Enter your response here..."
            value={responses.futureTopic}
            onChangeText={(text) => handleTextChange('futureTopic', text)}
          />
        </View>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question 8</Text>
          </View>
          <Text style={styles.questionText}>
            Please provide detailed suggestions on how to improve Buganda Bumu Conventions in the future.
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Enter your suggestions here..."
            value={responses.suggestions}
            onChangeText={(text) => handleTextChange('suggestions', text)}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Survey</Text>
              <Ionicons name="send" size={20} color={COLORS.white} style={styles.submitIcon} />
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your feedback! Your responses will help us improve future conventions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightBlue,
    marginTop: 4,
  },
  introContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  questionCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: 16,
    lineHeight: 22,
  },
  optionsContainer: {
    marginLeft: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: COLORS.primaryBlue,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primaryBlue,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.secondaryBlue,
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  thankYouTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginTop: 16,
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  newSurveyButton: {
    backgroundColor: COLORS.secondaryBlue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  newSurveyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
