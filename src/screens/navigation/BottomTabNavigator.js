import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser } from '../../utils/authService';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    
    loadUser();
  }, []);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        listeners={{
          tabPress: e => {
            // If user is not logged in, prevent default action and navigate to login
            if (!currentUser) {
              e.preventDefault();
              navigation.navigate('Auth', { screen: 'Login' });
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
