import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace with your actual Firebase project configuration if different
const firebaseConfig = {
  apiKey: "AIzaSyB0zLhNZ0ur-OMlft1AgTWRlhh5yY26m0Y",
  authDomain: "bbnacmobile.firebaseapp.com",
  projectId: "bbnacmobile",
  storageBucket: "bbnacmobile.firebasestorage.app",
  messagingSenderId: "374824739507",
  appId: "1:374824739507:web:c00b054578e661a51446c6",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Auth might already be initialized
  auth = getAuth(app);
}

const firestore = getFirestore(app);
const storage = getStorage(app);

// Export the Firebase services
export { auth, firestore, storage };

// Add this function to check if a user is an admin
export const isAdminUser = (user) => {
  // Replace with your admin email address
  return user && user.email === "admin@bbnac2025.com";
};
