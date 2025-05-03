import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_USER_KEY = 'auth_user';

// Static user credentials for authentication
const VALID_CREDENTIALS = [
  { email: 'registration1@bbnac.org', password: 'registration0523', role: 'registration_committee' },
  { email: 'registration2@bbnac.org', password: 'registration0524', role: 'registration_committee' },
  { email: 'registration3@bbnac.org', password: 'registration0525', role: 'registration_committee' }
];

// Login function
export const login = async (email, password) => {
  // Find user with matching credentials
  const user = VALID_CREDENTIALS.find(
    user => user.email === email && user.password === password
  );
  
  if (user) {
    // Create user object without the password
    const userData = {
      uid: `user-${Date.now()}`, // Generate a simple unique ID
      email: user.email,
      role: user.role,
      displayName: user.email.split('@')[0], // Use part of email as display name
      isAuthenticated: true
    };
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    return userData;
  }
  
  throw new Error('Invalid email or password');
};

// Logout function
export const logout = async () => {


  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(AUTH_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null && user.isAuthenticated === true;
};

// Check if user is admin
export const isAdmin = async () => {
  const user = await getCurrentUser();
  return user !== null && user.role === 'admin';
};

// Check if user is registration committee member
export const isRegistrationCommittee = async () => {
  const user = await getCurrentUser();
  return user !== null && user.role === 'registration_committee';
};

// Setup auth listener (simplified version)
export const setupAuthListener = (callback) => {
  // Initial check
  const checkAuthState = async () => {
    const user = await getCurrentUser();
    callback(user);
  };
  
  checkAuthState();
  
  // Return an unsubscribe function
  return () => {
    // Nothing to unsubscribe in this implementation
  };
};