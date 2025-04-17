import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LoginIcon = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons name="person-circle-outline" size={24} color="#3498db" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default LoginIcon;
