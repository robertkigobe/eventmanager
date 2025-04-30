import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions
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
  warningColor: '#f57c00',
  highlightYellow: '#ffd700',
  red: '#e53935',
};

// Track colors for visual differentiation
const TRACK_COLORS = {
  'General': '#6a7fc8',
  'Education': '#4caf50',
  'Worship': '#9c27b0',
  'Outreach': '#ff9800',
  'Break': '#9e9e9e',
  'Spiritual': '#8d6e63',
  'Technology': '#00bcd4',
  'Youth': '#e91e63',
  'History': '#795548',
  'Pastoral': '#3f51b5',
  'Missions': '#f44336',
  'Leadership': '#ffc107',
  'Meal': '#ff5722',
  'Registration': '#607d8b',
  'Clan': '#673ab7',
  'Tour': '#009688',
  'Children': '#cddc39',
  'Ceremony': '#3f51b5',
  'Entertainment': '#9c27b0',
  'Fitness': '#ff5722',
  'Plenary': '#2196f3',
  'Cultural': '#ff4081',
};

// Program data for BBNAC'25
const PROGRAM_SESSIONS = [
  // Day 1 - Friday, May 23, 2025
  {
    id: '1',
    title: 'Breakfast',
    description: 'Breakfast on your own',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '06:30',
    endTime: '09:00',
    location: 'Various',
    track: 'Meal',
  },
  {
    id: '2',
    title: 'Check-in of Registered Delegates',
    description: 'Registration and check-in for all convention delegates',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '09:00',
    endTime: '21:00',
    location: 'TBA',
    track: 'Registration',
  },
  // Add more Friday sessions here
  
  // Day 2 - Saturday, May 24, 2025
  {
    id: '17',
    title: 'Dduyiro (Physical Fitness)',
    description: '\'Buganda Yeetaaga Abantu Abalamu\' session with the Katikkiro',
    speaker: 'Katikkiro',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '06:00',
    endTime: '06:40',
    location: 'Gym',
    track: 'Fitness',
  },
  // Add more Saturday sessions here
  
  // Day 3 - Sunday, May 25, 2025
  {
    id: '62',
    title: 'Ssaabasajja Kabaka 70th Birthday Run/Walk',
    description: 'Physical activity to celebrate Kabaka\'s birthday',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '06:30',
    endTime: '08:00',
    location: 'Gym/TBA',
    track: 'Fitness',
  },
  // Add more Sunday sessions here
  
  // Day 4 - Monday, May 26, 2025
  {
    id: '86',
    title: 'Breakfast and Farewell',
    description: 'Breakfast on your own and farewell',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Monday',
    date: '2025-05-26',
    startTime: '07:00',
    endTime: '09:00',
    location: 'Various',
    track: 'Meal',
  },
  // Add more Monday sessions here
];

// Create a separate component for session items
const SessionItem = React.memo(({ item, index, isActive, isExpanded, selectedDay, pulseAnim, onToggleExpand }) => {
  const itemAnimValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(itemAnimValue, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [selectedDay, index]);
  
  const itemTranslate = itemAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  
  const itemOpacity = itemAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  return (
    <Animated.View 
      style={[
        styles.sessionItem,
        { 
          transform: [{ translateY: itemTranslate }],
          opacity: itemOpacity,
          borderLeftColor: TRACK_COLORS[item.track] || COLORS.primaryBlue,
          borderLeftWidth: 4,
        },
        isActive && { 
          transform: [{ scale: pulseAnim }],
          borderWidth: 1,
          borderColor: COLORS.highlightYellow,
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.sessionHeader}
        onPress={() => onToggleExpand(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.sessionTimeLocation}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color={COLORS.secondaryBlue} />
            <Text style={styles.sessionTime}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={COLORS.secondaryBlue} />
            <Text style={styles.sessionLocation}>{item.location}</Text>
          </View>
        </View>
        
        <View style={styles.sessionMain}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionTitle}>{item.title}</Text>
            {isActive && (
              <View style={styles.liveIndicator}>
                <Text style={styles.liveIndicatorText}>LIVE</Text>
              </View>
            )}
          </View>
          
          {item.speaker ? (
            <View style={styles.speakerRow}>
              {item.speakerImage ? (
                <Image 
                  source={{ uri: item.speakerImage }} 
                  style={styles.speakerImage} 
                />
              ) : (
                <View style={styles.speakerImagePlaceholder}>
                  <Ionicons name="person" size={16} color={COLORS.white} />
                </View>
              )}
              <View style={styles.speakerInfo}>
                <Text style={styles.speakerName}>{item.speaker}</Text>
                {item.speakerTitle ? (
                  <Text style={styles.speakerTitle}>{item.speakerTitle}</Text>
                ) : null}
              </View>
            </View>
          ) : null}
          
          <View style={styles.trackBadge}>
            <Text style={styles.trackText}>{item.track}</Text>
          </View>
        </View>
        
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={COLORS.secondaryBlue} 
          style={styles.expandIcon}
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionDescription}>{item.description}</Text>
        </View>
      )}
    </Animated.View>
  );
});

export default function ProgramScreen() {
  const [selectedDay, setSelectedDay] = useState('Friday');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnim] = useState(new Animated.Value(1));
  const [expandedSession, setExpandedSession] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Filter sessions by selected day
  const filteredSessions = PROGRAM_SESSIONS.filter(
    session => session.day === selectedDay
  );

  // Start pulse animation for active sessions
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // For demo purposes, we'll simulate the convention happening today
  // This allows us to show "active" sessions
  const isSessionActive = (session) => {
    // Get current hours and minutes
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Check if current time is between session start and end times
    return currentTimeString >= session.startTime && currentTimeString <= session.endTime;
  };

  // Toggle session expanded state
  const toggleSessionExpanded = (sessionId) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Render day tabs
  const renderDayTabs = () => {
    const days = ['Friday', 'Saturday', 'Sunday', 'Monday']; 
    
    return (
      <View style={styles.dayTabsContainer}>
        {days.map(day => {
          const isActive = selectedDay === day;
          
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayTab,
                isActive && styles.dayTabActive
              ]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayTabText,
                isActive && styles.dayTabTextActive
              ]}>
                {day}
              </Text>
              {isActive && <View style={styles.dayTabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Render session item
  const renderSessionItem = ({ item, index }) => {
    const isActive = isSessionActive(item);
    const isExpanded = expandedSession === item.id;
    
    return (
      <SessionItem
        item={item}
        index={index}
        isActive={isActive}
        isExpanded={isExpanded}
        selectedDay={selectedDay}
        pulseAnim={pulseAnim}
        onToggleExpand={toggleSessionExpanded}
      />
    );
  };

  // Main component return
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Program Schedule</Text>
        <Text style={styles.headerSubtitle}>BBNAC Annual Convention</Text>
      </View>
      
      {/* Day tabs */}
      {renderDayTabs()}
      
      {/* Sessions list */}
      <FlatList
        data={filteredSessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sessionsList}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={COLORS.borderColor} />
            <Text style={styles.emptyText}>No sessions scheduled for this day</Text>
          </View>
        }
      />
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
    color: COLORS.lightBlue,
  },
  dayTabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  dayTabActive: {
    borderBottomColor: COLORS.primaryBlue,
  },
  dayTabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayTabTextActive: {
    color: COLORS.primaryBlue,
  },
  sessionsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 1,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    width: 80,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sessionSpeaker: {
    fontSize: 16,
    marginBottom: 2,
  },
  sessionLocation: {
    fontSize: 14,
    color: COLORS.gray,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
  },
});
