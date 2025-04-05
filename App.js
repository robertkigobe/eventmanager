import React, { useCallback, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

// Import screens
import RegisterScreen from './src/screens/RegisterScreen';
import CheckinScreen from './src/screens/CheckinScreen';
import SurveyScreen from './src/screens/SurveyScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import ProgramScreen from './src/screens/ProgramScreen';
import MyRegistrationsScreen from './src/screens/MyRegistrationsScreen';
import HomeScreen from './src/screens/HomeScreen';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue (primary color from BBNAC)
  secondaryBlue: '#0077c8', // Lighter blue (secondary color from BBNAC)
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  borderColor: '#e1e1e1',
};

// Create drawer navigator
const Drawer = createDrawerNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Create a Programming screen component
function ProgrammingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Programming</Text>
      <Text style={styles.subtitle}>Convention schedule and events</Text>
    </View>
  );
}

// Custom Drawer Content
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView 
      {...props}
      contentContainerStyle={styles.drawerContentContainer}
    >
      <View style={styles.drawerHeader}>
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.drawerLogo}
          resizeMode="contain"
        />
        <Text style={styles.drawerTitle}>BBNAC 2025</Text>
        <Text style={styles.drawerSubtitle}>Convention App</Text>
      </View>
      
      <View style={styles.drawerDivider} />
      
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>
      
      <View style={styles.drawerFooter}>
        <Text style={styles.drawerFooterText}>© 2025 BBNAC</Text>
        <Text style={styles.drawerFooterVersion}>App Version 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

// Authentication button component for the header
function AuthButton({ navigation }) {
  const handleAuthPress = () => {
    // Handle authentication logic here
    alert('Authentication feature will be implemented here');
  };

  return (
    <TouchableOpacity 
      style={styles.authButton} 
      onPress={handleAuthPress}
    >
      <Ionicons name="person-circle" size={28} color={COLORS.white} />
    </TouchableOpacity>
  );
}

// Create a modified AdminDashboardScreen that includes the CheckinScreen
function EnhancedAdminDashboardScreen({ navigation }) {
  // We'll create a tabbed interface in the AdminDashboardScreen
  // that includes the CheckinScreen functionality
  return (
    <AdminDashboardScreen checkinScreen={CheckinScreen} navigation={navigation} />
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Drawer.Navigator 
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: COLORS.primaryBlue,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <AuthButton navigation={navigation} />,
          drawerStyle: {
            backgroundColor: COLORS.white,
            width: 300,
          },
          drawerActiveTintColor: COLORS.secondaryBlue,
          drawerInactiveTintColor: COLORS.textDark,
          drawerActiveBackgroundColor: COLORS.lightBlue,
          drawerItemStyle: {
            borderRadius: 8,
            paddingVertical: 5,
            marginVertical: 4,
            marginHorizontal: 12,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 8, // Increased spacing between icon and label
          },
          drawerIconStyle: {
            marginRight: 8, // Added spacing after icon
          }
        })}
      >
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: 'BBNAC 2025',
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            )
          }}
        />
        <Drawer.Screen 
          name="Programming" 
          component={ProgramScreen} 
          options={{
            title: 'Programming',
            drawerLabel: 'Programming',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar-clock" size={size} color={color} />
            )
          }}
        />
        <Drawer.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{
            title: 'Register',
            drawerLabel: 'Register',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="app-registration" size={size} color={color} />
            )
          }}
        />
        <Drawer.Screen 
          name="MyRegistrations" 
          component={MyRegistrationsScreen} 
          options={{
            title: 'My Registrations',
            drawerLabel: 'My Registrations',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="ticket-confirmation" size={size} color={color} />
            )
          }}
        />
        <Drawer.Screen 
          name="Survey" 
          component={SurveyScreen} 
          options={{
            title: 'Survey',
            drawerLabel: 'Survey',
            drawerIcon: ({ color, size }) => (
              <FontAwesome5 name="clipboard-list" size={size} color={color} />
            )
          }}
        />
        <Drawer.Screen 
          name="Admin Dashboard" 
          component={EnhancedAdminDashboardScreen}
          options={{
            title: 'Admin Dashboard',
            drawerLabel: 'Admin Dashboard',
            drawerIcon: ({color, size}) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            )
          }}
        />
      </Drawer.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.primaryBlue,
    marginBottom: 10,
    textAlign: 'center',
  },
  conventionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.secondaryBlue,
    textAlign: 'center',
  },
  authButton: {
    marginRight: 15,
    padding: 5,
  },
  // Drawer styles
  drawerContentContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: COLORS.lightBlue,
    alignItems: 'center',
  },
  drawerLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    textAlign: 'center',
  },
  drawerSubtitle: {
    fontSize: 16,
    color: COLORS.secondaryBlue,
    marginTop: 5,
    textAlign: 'center',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 5,
  },
  drawerFooterVersion: {
    fontSize: 12,
    color: COLORS.textDark,
    opacity: 0.7,
  },
  // New styles for enhanced home screen
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
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },
  speakerRole: {
    fontSize: 12,
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
