import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, logout } from '../utils/staticAuthService'; // Use your auth service

const LoginIcon = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    
    checkAuthStatus();
  }, []);

  const handlePress = () => {
    if (user) {
      setMenuVisible(true);
    } else {
      navigation.navigate('Auth', { screen: 'Login' });
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setMenuVisible(false);
    // Optionally navigate to home or refresh current screen
    navigation.navigate('Home');
  };

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Ionicons 
          name={user ? "person-circle" : "person-circle-outline"} 
          size={24} 
          color="#3498db" 
        />
      </TouchableOpacity>
      
      {/* Profile Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.userName}>{user?.displayName || user?.email}</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Profile');
              }}
            >
              <Ionicons name="person" size={20} color="#333" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="#333" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 60,
    marginRight: 10,
    borderRadius: 8,
    padding: 10,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default LoginIcon;
