import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Key for storing auth user data
const AUTH_USER_KEY = 'firebase_auth_user';

// Save user data when auth state changes
export const setupAuthPersistence = () => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, save minimal user data to AsyncStorage
      try {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error('Error saving auth state:', error);
      }
    } else {
      // User is signed out, remove data from AsyncStorage
      try {
        await AsyncStorage.removeItem(AUTH_USER_KEY);
      } catch (error) {
        console.error('Error removing auth state:', error);
      }
    }
  });
};

// Get saved user data
export const getSavedUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(AUTH_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting saved user data:', error);
    return null;
  }
};
