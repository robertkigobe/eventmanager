import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginIcon from '../../components/LoginIcon';
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
      {/* Add other screens */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
