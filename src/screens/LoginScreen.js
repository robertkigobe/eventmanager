// Replace Firebase auth imports with your new auth service
import { signIn } from '../utils/authService';

// Then in your login function:
const handleLogin = async () => {
  try {
    await signIn(email, password);
    navigation.navigate('Home');
  } catch (error) {
    setError(error.message);
  }
};
