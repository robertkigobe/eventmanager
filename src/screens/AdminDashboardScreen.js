import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  borderColor: '#cccccc',
};

export default function AdminDashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Registration Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>124</Text>
            <Text style={styles.statLabel}>Total Registrations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>87</Text>
            <Text style={styles.statLabel}>Full Convention</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>37</Text>
            <Text style={styles.statLabel}>Day Passes</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionItem}>
          <Text style={styles.actionTitle}>Export Registration Data</Text>
          <Text style={styles.actionDescription}>Download a CSV file of all registrations</Text>
        </View>
        <View style={styles.actionItem}>
          <Text style={styles.actionTitle}>Send Mass Email</Text>
          <Text style={styles.actionDescription}>Send an email to all registered attendees</Text>
        </View>
        <View style={styles.actionItem}>
          <Text style={styles.actionTitle}>Manage Event Schedule</Text>
          <Text style={styles.actionDescription}>Update event sessions and speakers</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityTime}>Today, 2:30 PM</Text>
          <Text style={styles.activityText}>New registration: John Smith</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityTime}>Today, 1:15 PM</Text>
          <Text style={styles.activityText}>New registration: Sarah Johnson</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityTime}>Yesterday, 4:45 PM</Text>
          <Text style={styles.activityText}>Updated event schedule</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondaryBlue,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  actionItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  actionDescription: {
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 5,
  },
  activityItem: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.secondaryBlue,
    marginBottom: 3,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
});
