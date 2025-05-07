import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Linking
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ImageSlideshow from '../components/ImageSlideshow';

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
};

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.homeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Logo */}
        <View style={styles.homeHeader}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.homeLogo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.conventionTitle}>BBNAC Convention 2025</Text>
          <Text style={styles.conventionDate}>May 23-25, 2025</Text>
        </View>
        
        {/* Convention Theme Banner */}
        <View style={styles.themeBanner}>
          <Text style={styles.themeTitle}>Convention Theme</Text>
          <Text style={styles.themeText}>"Strengthening Our Baptist Identity in a Changing World"</Text>
        </View>
        
        {/* Highlights Section */}
        <View style={styles.highlightsSection}>
          <Text style={styles.sectionTitle}>Convention Highlights</Text>
          
          {/* Featured Speakers */}
          <View style={styles.highlightCard}>
            <View style={styles.highlightHeader}>
              <Ionicons name="people" size={24} color={COLORS.primaryBlue} />
              <Text style={styles.highlightTitle}>Featured Speakers</Text>
            </View>
            <View style={styles.speakersContainer}>
              <View style={styles.speakerItem}>
                <Image 
                  source={require('../../assets/nsibirwa.jpeg')} 
                  style={styles.speakerImage}
                />
                <Text style={styles.speakerName}>Oweekitiibwa Robert Waggwa Nsibirwa</Text>
                <Text style={styles.speakerRole}>Omumyuka Ow’Okubbiri owa Katikkiro,  Era Omuwanika.</Text>
              </View>
              <View style={styles.speakerItem}>
                <Image 
                  source={require('../../assets/katikiro.jpeg')} 
                  style={styles.speakerImage}
                />
                <Text style={styles.speakerName}>Katikkiro Peter Charles Mayiga
                </Text>
                <Text style={styles.speakerRole}>Prime Minister: Buganda Kingdom, Keynote speaker</Text>
              </View>
              <View style={styles.speakerItem}>
                <Image 
                  source={require('../../assets/kawuki.jpeg')} 
                  style={styles.speakerImage}
                />
                <Text style={styles.speakerName}>Oweekitiibwa Joseph Kawuki</Text>
                <Text style={styles.speakerRole}>Ministrer </Text>
              </View>
            </View>
          </View>
          
          {/* Key Events */}
          <View style={styles.highlightCard}>
            <View style={styles.highlightHeader}>
              <Ionicons name="calendar" size={24} color={COLORS.primaryBlue} />
              <Text style={styles.highlightTitle}>Key Events</Text>
            </View>
            <View style={styles.eventsContainer}>
              <TouchableOpacity style={styles.eventItem}>
                <View style={styles.eventDayBadge}>
                  <Text style={styles.eventDayText}>FRI</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>Private Meetings of Clans</Text>
                  <Text style={styles.eventTime}>9:00 AM - Main Auditorium</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBlue} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.eventItem}>
                <View style={styles.eventDayBadge}>
                  <Text style={styles.eventDayText}>SAT</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>Ssaabasajja Kabaka's Message</Text>
                  <Text style={styles.eventTime}>9:45 AM - Ballroom</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBlue} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.eventItem}>
                <View style={styles.eventDayBadge}>
                  <Text style={styles.eventDayText}>SUN</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>BBANC General Annual Assembly</Text>
                  <Text style={styles.eventTime}>2:00 PM - Ballroom</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.secondaryBlue} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Programming')}
            >
              <Text style={styles.viewAllButtonText}>View Full Program</Text>
            </TouchableOpacity>
          </View>
          
          {/* Location */}
          <View style={styles.highlightCard}>
            <View style={styles.highlightHeader}>
              <Ionicons name="location" size={24} color={COLORS.primaryBlue} />
              <Text style={styles.highlightTitle}>Convention Location</Text>
            </View>
            <View style={styles.locationContainer}>
              <View style={styles.locationImageContainer}>
                <Image 
                  source={{uri: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'}} 
                  style={styles.locationImage}
                />
              </View>
              <Text style={styles.locationName}>Omni Hotel</Text>
              <Text style={styles.locationAddress}>450 Summer st, Boston, MA 02210</Text>
              <TouchableOpacity style={styles.mapButton}>
                <Ionicons name="map" size={16} color={COLORS.white} />
                <Text style={styles.mapButtonText}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Register')}
            >
              <View style={[styles.quickActionIcon, {backgroundColor: COLORS.secondaryBlue}]}>
                <MaterialIcons name="app-registration" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Register</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Programming')}
            >
              <View style={[styles.quickActionIcon, {backgroundColor: '#9c27b0'}]}>
                <MaterialCommunityIcons name="calendar-clock" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Program</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => alert('Contact: robertkigobe@gmail.com')}
            >
              <View style={[styles.quickActionIcon, {backgroundColor: '#ff9800'}]}>
                <MaterialCommunityIcons name="ticket-confirmation" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Tech Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Survey')}
            >
              <View style={[styles.quickActionIcon, {backgroundColor: '#4caf50'}]}>
                <FontAwesome5 name="clipboard-list" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionText}>Survey</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* News & Updates - Changed to Image Slideshow */}
        <View style={styles.newsSection}>
          <Text style={styles.sectionTitle}>Event Gallery</Text>
          <ImageSlideshow />
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BBNAC Convention</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Visit bbnac.org</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  homeHeader: {
    backgroundColor: COLORS.primaryBlue,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  homeLogo: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.lightBlue,
    marginBottom: 5,
  },
  conventionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  conventionDate: {
    fontSize: 18,
    color: COLORS.lightBlue,
    marginTop: 5,
  },
  themeBanner: {
    backgroundColor: COLORS.secondaryBlue,
    padding: 20,
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.lightBlue,
    marginBottom: 5,
  },
  themeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  highlightsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 15,
  },
  highlightCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginLeft: 10,
  },
  speakersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speakerItem: {
    alignItems: 'center',
    width: '30%',
  },
  speakerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },
  speakerRole: {
    fontSize: 10,
    color: COLORS.secondaryBlue,
    textAlign: 'center',
  },
  eventsContainer: {
    marginBottom: 15,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  eventDayBadge: {
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 12,
  },
  eventDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  eventTime: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
  },
  viewAllButton: {
    backgroundColor: COLORS.lightBlue,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  mapButton: {
    backgroundColor: COLORS.secondaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  mapButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    marginLeft: 5,
  },
  quickActionsSection: {
    padding: 20,
    backgroundColor: COLORS.lightBlue,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  newsSection: {
    padding: 20,
  },
  newsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  newsDate: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    marginBottom: 5,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  newsExcerpt: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    marginBottom: 10,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: COLORS.secondaryBlue,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.primaryBlue,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.lightBlue,
    marginBottom: 5,
  },
  footerLink: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
