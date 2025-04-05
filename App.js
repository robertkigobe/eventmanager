import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from 'react-native';
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

// Create a Home screen component with logo background and welcome message
function HomeScreen() {
  return (
    <ImageBackground 
      source={require('./assets/logo.png')} 
      style={styles.backgroundImage}
      resizeMode="contain"
    >
      <View style={styles.overlay}>
        <Text style={styles.welcomeTitle}>Welcome to</Text>
        <Text style={styles.conventionTitle}>BBNAC Convention 2025</Text>
      </View>
    </ImageBackground>
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
});
