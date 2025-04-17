import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginIcon from '../../components/LoginIcon';
import RegistrationListScreen from '../screens/RegistrationListScreen';
import RegistrationDetailsScreen from '../screens/RegistrationDetailsScreen';
// Import other screens

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          headerRight: () => <LoginIcon />,
        }}
      />
      <Stack.Screen name="RegistrationList" component={RegistrationListScreen} />
      <Stack.Screen name="RegistrationDetails" component={RegistrationDetailsScreen} />
      {/* Add other screens */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
