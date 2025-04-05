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
  Platform,
  ScrollView,
  DayTabs,
  Header,
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

// Dummy data for program sessions
const DUMMY_SESSIONS = [
  // Day 1 - Thursday
  {
    id: '1',
    title: 'Opening Ceremony',
    description: 'Welcome address and introduction to the convention theme',
    speaker: 'Dr. James Wilson',
    speakerTitle: 'BBNAC President',
    speakerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    day: 'Thursday',
    date: '2025-06-12',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Main Auditorium',
    track: 'General',
  },
  {
    id: '2',
    title: 'The Future of Baptist Education',
    description: 'Exploring new approaches to theological education in the digital age',
    speaker: 'Dr. Sarah Johnson',
    speakerTitle: 'Dean of Education, Baptist Seminary',
    speakerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    day: 'Thursday',
    date: '2025-06-12',
    startTime: '11:00',
    endTime: '12:30',
    location: 'Room A',
    track: 'Education',
  },
  {
    id: '3',
    title: 'Lunch Break',
    description: 'Networking lunch with regional groups',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Thursday',
    date: '2025-06-12',
    startTime: '12:30',
    endTime: '14:00',
    location: 'Dining Hall',
    track: 'Break',
  },
  {
    id: '4',
    title: 'Modern Worship Workshop',
    description: 'Hands-on workshop exploring contemporary worship styles and techniques',
    speaker: 'Pastor Michael Brown',
    speakerTitle: 'Worship Director, Grace Baptist Church',
    speakerImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    day: 'Thursday',
    date: '2025-06-12',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room B',
    track: 'Worship',
  },
  {
    id: '5',
    title: 'Community Outreach Strategies',
    description: 'Effective methods for engaging with your local community',
    speaker: 'Rev. Emily Davis',
    speakerTitle: 'Outreach Coordinator, First Baptist',
    speakerImage: 'https://randomuser.me/api/portraits/women/28.jpg',
    day: 'Thursday',
    date: '2025-06-12',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Room C',
    track: 'Outreach',
  },
  {
    id: '6',
    title: 'Evening Worship Service',
    description: 'Worship service with special guest choir',
    speaker: 'Rev. Thomas Clark',
    speakerTitle: 'Senior Pastor, Calvary Baptist',
    speakerImage: 'https://randomuser.me/api/portraits/men/52.jpg',
    day: 'Thursday',
    date: '2025-06-12',
    startTime: '19:00',
    endTime: '21:00',
    location: 'Main Auditorium',
    track: 'Worship',
  },
  
  // Day 2 - Friday
  {
    id: '7',
    title: 'Morning Prayer',
    description: 'Guided prayer and devotional',
    speaker: 'Pastor Robert Wilson',
    speakerTitle: 'Prayer Ministry Director',
    speakerImage: 'https://randomuser.me/api/portraits/men/42.jpg',
    day: 'Friday',
    date: '2025-06-13',
    startTime: '08:00',
    endTime: '08:45',
    location: 'Chapel',
    track: 'Spiritual',
  },
  {
    id: '8',
    title: 'Digital Ministry in the 21st Century',
    description: 'Leveraging technology for effective ministry and outreach',
    speaker: 'Mark Thompson',
    speakerTitle: 'Digital Strategist, Baptist Media',
    speakerImage: 'https://randomuser.me/api/portraits/men/64.jpg',
    day: 'Friday',
    date: '2025-06-13',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Room A',
    track: 'Technology',
  },
  {
    id: '9',
    title: 'Youth Ministry Panel Discussion',
    description: 'Engaging the next generation: challenges and opportunities',
    speaker: 'Panel of Youth Leaders',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-06-13',
    startTime: '11:00',
    endTime: '12:30',
    location: 'Room B',
    track: 'Youth',
  },
  {
    id: '10',
    title: 'Lunch Break',
    description: 'Networking lunch with interest groups',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-06-13',
    startTime: '12:30',
    endTime: '14:00',
    location: 'Dining Hall',
    track: 'Break',
  },
  {
    id: '11',
    title: 'Baptist History and Heritage',
    description: 'Exploring our roots and their relevance today',
    speaker: 'Dr. Jennifer Adams',
    speakerTitle: 'Professor of Baptist Studies',
    speakerImage: 'https://randomuser.me/api/portraits/women/36.jpg',
    day: 'Friday',
    date: '2025-06-13',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room C',
    track: 'History',
  },
  {
    id: '12',
    title: 'Pastoral Care in Crisis',
    description: 'Supporting congregants through personal and community crises',
    speaker: 'Dr. Samuel Green',
    speakerTitle: 'Pastoral Counselor',
    speakerImage: 'https://randomuser.me/api/portraits/men/76.jpg',
    day: 'Friday',
    date: '2025-06-13',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Room A',
    track: 'Pastoral',
  },
  
  // Day 3 - Saturday
  {
    id: '13',
    title: 'Morning Worship',
    description: 'Praise and worship to start the day',
    speaker: 'Worship Team',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-06-14',
    startTime: '08:30',
    endTime: '09:30',
    location: 'Main Auditorium',
    track: 'Worship',
  },
  {
    id: '14',
    title: 'Missions in a Changing World',
    description: 'Adapting mission strategies for global challenges',
    speaker: 'Rev. Maria Rodriguez',
    speakerTitle: 'International Mission Board',
    speakerImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    day: 'Saturday',
    date: '2025-06-14',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Room B',
    track: 'Missions',
  },
  {
    id: '15',
    title: 'Church Leadership Summit',
    description: 'Developing effective leadership teams in your church',
    speaker: 'Dr. William Parker',
    speakerTitle: 'Leadership Consultant',
    speakerImage: 'https://randomuser.me/api/portraits/men/92.jpg',
    day: 'Saturday',
    date: '2025-06-14',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Room A',
    track: 'Leadership',
  },
  {
    id: '16',
    title: 'Lunch Break',
    description: 'Final networking lunch',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-06-14',
    startTime: '12:00',
    endTime: '13:30',
    location: 'Dining Hall',
    track: 'Break',
  },
  {
    id: '17',
    title: 'Closing Session',
    description: 'Reflection on the convention and vision for the future',
    speaker: 'Dr. James Wilson',
    speakerTitle: 'BBNAC President',
    speakerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    day: 'Saturday',
    date: '2025-06-14',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Main Auditorium',
    track: 'General',
  },
];

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
};

const { width } = Dimensions.get('window');

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
  const [selectedDay, setSelectedDay] = useState('Thursday');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnim] = useState(new Animated.Value(1));
  const [expandedSession, setExpandedSession] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });
  
  // Filter sessions by selected day
  const filteredSessions = DUMMY_SESSIONS.filter(
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
    const days = ['Thursday', 'Friday', 'Saturday'];
    
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

  // Simplified renderSessionItem function that doesn't use hooks
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
    shadowRadius: 3,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabActive: {
    backgroundColor: COLORS.white,
  },
  dayTabText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  dayTabTextActive: {
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
  },
  dayTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '50%',
    backgroundColor: COLORS.primaryBlue,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  sessionsList: {
    padding: 12,
  },
  sessionItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    padding: 16,
  },
  sessionTimeLocation: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionTime: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    marginLeft: 4,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionLocation: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    marginLeft: 4,
  },
  sessionMain: {
    marginBottom: 8,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
  },
  liveIndicator: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  liveIndicatorText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  speakerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  speakerImagePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  speakerTitle: {
    fontSize: 13,
    color: COLORS.textDark,
    opacity: 0.7,
  },
  trackBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trackText: {
    fontSize: 12,
    color: COLORS.primaryBlue,
    fontWeight: '500',
  },
  expandIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  sessionDetails: {
    padding: 16,
    backgroundColor: COLORS.lightBlue,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  sessionDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
  },
});
