import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

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
  gray: '#757575',
  lightGray: '#f5f5f5',
};

const { width } = Dimensions.get('window');



// Mock data for dashboard statistics
const DASHBOARD_STATS = [
  { id: '1', title: 'Registered', count: totalRegistrations, icon: 'people', color: COLORS.secondaryBlue },
  { id: '2', title: 'Checked In', count: 875, icon: 'checkmark-circle', color: COLORS.successColor },
  { id: '3', title: 'Surveys', count: 432, icon: 'document-text', color: COLORS.warningColor },
];

// Mock data for recent activities
const RECENT_ACTIVITIES = [
  { id: '1', action: 'Registration', name: 'John Smith', time: '10 minutes ago' },
  { id: '2', action: 'Check-in', name: 'Sarah Johnson', time: '25 minutes ago' },
  { id: '3', action: 'Survey Completed', name: 'Michael Brown', time: '1 hour ago' },
  { id: '4', action: 'Registration', name: 'Emily Davis', time: '2 hours ago' },
  { id: '5', action: 'Check-in', name: 'Robert Wilson', time: '3 hours ago' },
];

export default function AdminDashboardScreen({ navigation, checkinScreen: CheckinScreen }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [surveyCount, setSurveyCount] = useState(0);
  // Render tab bar
  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]} 
          onPress={() => setActiveTab('dashboard')}
        >
          <MaterialIcons 
            name="dashboard" 
            size={24} 
            color={activeTab === 'dashboard' ? COLORS.primaryBlue : COLORS.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'checkin' && styles.activeTab]} 
          onPress={() => setActiveTab('checkin')}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color={activeTab === 'checkin' ? COLORS.primaryBlue : COLORS.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'checkin' && styles.activeTabText]}>
            Check-in
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]} 
          onPress={() => setActiveTab('reports')}
        >
          <FontAwesome5 
            name="chart-bar" 
            size={22} 
            color={activeTab === 'reports' ? COLORS.primaryBlue : COLORS.gray} 
          />
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Render dashboard content
  const renderDashboard = () => {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {DASHBOARD_STATS.map(stat => (
            <TouchableOpacity 
              key={stat.id} 
              style={styles.statCard}
              onPress={() => {
                // Add navigation for the registration stat
                if (stat.title.includes('Registered') || stat.id === 'registrations') {
                  navigation.navigate('RegistrationList');
                }
              }}
            >
              <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon} size={24} color={COLORS.white} />
              </View>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setActiveTab('checkin')}
            >
              <Ionicons name="checkmark-circle" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Check-in</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: COLORS.secondaryBlue }]}
              onPress={() => navigation.navigate('Register')}
            >
              <MaterialIcons name="app-registration" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Register</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: COLORS.warningColor }]}
              onPress={() => navigation.navigate('Survey')}
            >
              <FontAwesome5 name="clipboard-list" size={22} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Survey</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {RECENT_ACTIVITIES.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Ionicons 
                    name={
                      activity.action === 'Registration' 
                        ? 'person-add' 
                        : activity.action === 'Check-in' 
                          ? 'checkmark-circle' 
                          : 'document-text'
                    } 
                    size={20} 
                    color={COLORS.white} 
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };
  
  // Render reports content
  const renderReports = () => {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <FontAwesome5 name="chart-bar" size={60} color={COLORS.borderColor} />
          <Text style={styles.emptyStateTitle}>Reports Coming Soon</Text>
          <Text style={styles.emptyStateText}>
            Detailed analytics and reports will be available in a future update.
          </Text>
        </View>
      </View>
    );
  };
  
  // Main render
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Tab Bar */}
      {renderTabBar()}
      
      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'checkin' && <CheckinScreen isEmbedded={true} />}
      {activeTab === 'reports' && renderReports()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  contentContainer: {
    padding: 16,
  },
  tabBar: {
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
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primaryBlue,
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 48) / 3,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: (width - 48) / 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: COLORS.white,
    marginTop: 8,
    fontWeight: '500',
  },
  activityContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  activityName: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    maxWidth: 300,
  },
});
