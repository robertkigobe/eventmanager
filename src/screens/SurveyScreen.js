import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  gray: '#757575',
  lightGray: '#e1e1e1',
  green: '#4CAF50',
  amber: '#FFC107',
  red: '#F44336',
  purple: '#9C27B0',
};

const { width, height } = Dimensions.get('window');

// Rating option component with animation
const RatingOption = ({ label, selected, onSelect, color, icon, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.7)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (selected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected]);

  return (
    <Animated.View
      style={[
        styles.ratingOption,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
          borderColor: selected ? color : COLORS.lightGray,
          backgroundColor: selected ? `${color}10` : COLORS.white,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.ratingButton}
        onPress={onSelect}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <Text style={[styles.ratingLabel, { color: selected ? color : COLORS.textDark }]}>
          {label}
        </Text>
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radioOuter,
              { borderColor: selected ? color : COLORS.gray },
            ]}
          >
            {selected && <View style={[styles.radioInner, { backgroundColor: color }]} />}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Progress bar component
const ProgressBar = ({ current, total }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const percentage = (current / total) * 100;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [current, total]);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width,
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        Question {current} of {total}
      </Text>
    </View>
  );
};

export default function SurveyScreen({ navigation }) {
  // Survey state
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // Survey questions data
  const questions = [
    {
      id: 1,
      question: 'Overall, how would you rate your experience during Buganda Bumu convention?',
      type: 'rating',
      options: [
        { value: 'Excellent', color: COLORS.green, icon: <Ionicons name="star" size={20} color={COLORS.white} /> },
        { value: 'Good', color: COLORS.amber, icon: <Ionicons name="thumbs-up" size={20} color={COLORS.white} /> },
        { value: 'Fair', color: COLORS.secondaryBlue, icon: <MaterialIcons name="thumbs-up-down" size={20} color={COLORS.white} /> },
        { value: 'Poor', color: COLORS.red, icon: <Ionicons name="thumbs-down" size={20} color={COLORS.white} /> },
      ],
    },
    {
      id: 2,
      question: 'Overall, how would you rate this convention?',
      type: 'rating',
      options: [
        { value: 'Has exceeded my expectations', color: COLORS.green, icon: <Ionicons name="trending-up" size={20} color={COLORS.white} /> },
        { value: 'Met my expectations', color: COLORS.amber, icon: <Ionicons name="checkmark-circle" size={20} color={COLORS.white} /> },
        { value: 'Has not met my expectations at all', color: COLORS.red, icon: <Ionicons name="trending-down" size={20} color={COLORS.white} /> },
      ],
    },
    {
      id: 3,
      question: 'Please indicate whether or not you agree that BBNAC is achieving its objectives of bringing together Baganda in North America to discuss cultural and socio-economic issues that concern them.',
      type: 'rating',
      options: [
        { value: 'Strongly Agree', color: COLORS.green, icon: <Ionicons name="checkmark-done" size={20} color={COLORS.white} /> },
        { value: 'Agree', color: COLORS.secondaryBlue, icon: <Ionicons name="checkmark" size={20} color={COLORS.white} /> },
        { value: 'Disagree', color: COLORS.amber, icon: <Ionicons name="close" size={20} color={COLORS.white} /> },
        { value: 'Strongly Disagree', color: COLORS.red, icon: <Ionicons name="close-circle" size={20} color={COLORS.white} /> },
      ],
    },
    {
      id: 4,
      question: 'Based on your experience at this convention, how likely are you to attend future Buganda Bumu conventions?',
      type: 'rating',
      options: [
        { value: 'Very Likely', color: COLORS.green, icon: <Ionicons name="calendar-check" size={20} color={COLORS.white} /> },
        { value: 'Likely', color: COLORS.amber, icon: <Ionicons name="calendar" size={20} color={COLORS.white} /> },
        { value: 'Not Likely', color: COLORS.red, icon: <Ionicons name="calendar-outline" size={20} color={COLORS.white} /> },
      ],
    },
    {
      id: 5,
      question: 'Most of the topics discussed during this first BBNAC were relevant and appropriate',
      type: 'rating',
      options: [
        { value: 'True', color: COLORS.green, icon: <Ionicons name="checkmark-circle" size={20} color={COLORS.white} /> },
        { value: 'False', color: COLORS.red, icon: <Ionicons name="close-circle" size={20} color={COLORS.white} /> },
        { value: "Don't know", color: COLORS.gray, icon: <Ionicons name="help-circle" size={20} color={COLORS.white} /> },
      ],
    },
    {
      id: 6,
      question: 'What topics were of most interest to you?',
      type: 'text',
      placeholder: 'Please share the topics that interested you the most...',
    },
    {
      id: 7,
      question: 'What other topics would you like to be discussed in future Buganda Bumu Conventions?',
      type: 'text',
      placeholder: 'Please suggest topics for future conventions...',
    },
    {
      id: 8,
      question: 'Please provide detailed suggestions on how to improve Buganda Bumu Conventions in the future.',
      type: 'text',
      placeholder: 'Your suggestions for improvement...',
      isLast: true,
    },
  ];

  // Handle question transition animations
  const animateToNextQuestion = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentQuestion(currentQuestion + 1);
      slideAnim.setValue(width);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animateToPrevQuestion = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentQuestion(currentQuestion - 1);
      slideAnim.setValue(-width);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Handle answer selection
  const handleSelectAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  // Handle text input change
  const handleTextChange = (questionId, text) => {
    setAnswers({
      ...answers,
      [questionId]: text,
    });
  };

  // Handle next button press
  const handleNext = () => {
    const currentQuestionData = questions.find(q => q.id === currentQuestion);
    
    // Validate if answer is provided for required questions
    if (currentQuestionData.type === 'rating' && !answers[currentQuestion]) {
      Alert.alert('Please select an option', 'Please select one of the options before proceeding.');
      return;
    }
    
    if (currentQuestion < questions.length) {
      animateToNextQuestion();
    } else {
      handleSubmit();
    }
  };

  // Handle previous button press
  const handlePrev = () => {
    if (currentQuestion > 1) {
      animateToPrevQuestion();
    }
  };

  // Handle survey submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Animate success screen
      Animated.spring(successAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
      
      // Log survey answers (replace with actual API call)
      console.log('Survey answers:', answers);
    }, 1500);
  };

  // Handle return to home
  const handleReturnHome = () => {
    navigation.navigate('Home');
  };

  // Current question data
  const currentQuestionData = questions.find(q => q.id === currentQuestion);

  // Render success screen after submission
  if (submitted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.primaryBlue, COLORS.secondaryBlue]}
          style={styles.successContainer}
        >
          <Animated.View
            style={[
              styles.successContent,
              {
                transform: [
                  { scale: successAnim },
                  { 
                    translateY: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }) 
                  }
                ],
                opacity: successAnim,
              },
            ]}
          >
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color={COLORS.white} />
            </View>
            <Text style={styles.successTitle}>Thank You!</Text>
            <Text style={styles.successMessage}>
              Your feedback has been submitted successfully. We appreciate your input to help improve future BBNAC conventions.
            </Text>
            <TouchableOpacity
              style={styles.returnHomeButton}
              onPress={handleReturnHome}
            >
              <Text style={styles.returnHomeButtonText}>Return to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post-Convention Survey</Text>
        <Text style={styles.headerSubtitle}>BBNAC Annual Convention</Text>
      </View>
      
      <ProgressBar current={currentQuestion} total={questions.length} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.questionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <Text style={styles.questionNumber}>Question {currentQuestion}</Text>
          <Text style={styles.questionText}>{currentQuestionData.question}</Text>
          
          {currentQuestionData.type === 'rating' && (
            <View style={styles.optionsContainer}>
              {currentQuestionData.options.map((option, index) => (
                <RatingOption
                  key={option.value}
                  label={option.value}
                  selected={answers[currentQuestion] === option.value}
                  onSelect={() => handleSelectAnswer(currentQuestion, option.value)}
                  color={option.color}
                  icon={option.icon}
                  delay={index * 100}
                />
              ))}
            </View>
          )}
          
          {currentQuestionData.type === 'text' && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={currentQuestionData.placeholder}
                placeholderTextColor={COLORS.gray}
                value={answers[currentQuestion] || ''}
                onChangeText={(text) => handleTextChange(currentQuestion, text)}
                multiline
                textAlignVertical="top"
                numberOfLines={5}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, { opacity: currentQuestion > 1 ? 1 : 0.5 }]}
          onPress={handlePrev}
          disabled={currentQuestion <= 1}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.navButtonText}>
                {currentQuestion < questions.length ? 'Next' : 'Submit'}
              </Text>
              <Ionicons 
                name={currentQuestion < questions.length ? "arrow-forward" : "checkmark-circle"} 
                size={20} 
                color={COLORS.white} 
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlue,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondaryBlue,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32,
  },
  questionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: COLORS.textDark,
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    marginTop: 8,
  },
  ratingOption: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  radioContainer: {
    marginLeft: 8,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  textInputContainer: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: COLORS.textDark,
    backgroundColor: COLORS.white,
    minHeight: 150,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
  },
  prevButton: {
    backgroundColor: COLORS.gray,
  },
  nextButton: {
    backgroundColor: COLORS.secondaryBlue,
  },
  navButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  returnHomeButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  returnHomeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

