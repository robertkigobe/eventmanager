import axios from 'axios';
import { getCurrentUser } from '../utils/staticAuthService';

// Base URL of your backend API
const API_BASE_URL = 'https://bbnac-app-backend.onrender.com';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if user is logged in
apiClient.interceptors.request.use(async (config) => {
  try {
    const user = await getCurrentUser();
    if (user) {
      // For a static implementation, you could use a simple token format
      config.headers.Authorization = `Bearer static-token-${user.uid}`;
      
      // Or if your backend doesn't actually validate tokens:
      // config.headers.Authorization = 'Bearer dummy-token';
    }
  } catch (error) {
    console.error('Error in auth interceptor:', error);
  }
  return config;
});

// Registration API functions
export const registrationApi = {
  // Get paginated list of registrations
  getRegistrations: async (page = 1, perPage = 10) => {
    try {
      const response = await apiClient.get(`/bbnac25/registrants?page=${page}&per_page=${perPage}`);
      
      // Debug: Log the raw response structure
      console.log('API Response structure:', JSON.stringify(response.data).substring(0, 200) + '...');
      
      // Check if the response has a data property or is the data itself
      const registrations = response.data.data || response.data;
      
      return registrations;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  },

  // Get a single registration with all registrants
  getRegistration: async (registrationId) => {
    try {
      const response = await apiClient.get(`/registrations/${registrationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registration ${registrationId}:`, error);
      throw error;
    }
  },

  // Create a new registration
  createRegistration: async (registrationData) => {
    try {
      console.log('Attempting to create registration with data:', JSON.stringify(registrationData));
      const response = await apiClient.post('/registrations/', registrationData);
      console.log('Registration created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating registration:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  // Get registrants for a specific registration
  getRegistrantsByRegistration: async (registrationId, page = 1, perPage = 10) => {
    try {
      const response = await apiClient.get(
        `/registrations/${registrationId}/registrants/?page=${page}&per_page=${perPage}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching registrants for registration ${registrationId}:`, error);
      throw error;
    }
  },

  // Create a new registrant
  createRegistrant: async (registrantData) => {
    try {
      const response = await apiClient.post('/bbnac25/registrants/', registrantData);
      return response.data;
    } catch (error) {
      console.error('Error creating registrant:', error);
      throw error;
    }
  },

  // Get a single registrant
  getRegistrant: async (registrantId) => {
    try {
      const response = await apiClient.get(`/bbnac25/registrants/${registrantId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registrant ${registrantId}:`, error);
      throw error;
    }
  },

  // Update a registrant
  updateRegistrant: async (registrantId, registrantData) => {
    try {
      const response = await apiClient.put(`/registrations/registrants/${registrantId}`, registrantData);
      return response.data;
    } catch (error) {
      console.error(`Error updating registrant ${registrantId}:`, error);
      throw error;
    }
  },

  // Delete a registrant
  deleteRegistrant: async (registrantId) => {
    try {
      await apiClient.delete(`/registrations/registrants/${registrantId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting registrant ${registrantId}:`, error);
      throw error;
    }
  },

  // Get all registrants list
  getRegistrantsList: async () => {
    try {
      const response = await apiClient.get('/bbnac25/registrants/');
      return response.data;
    } catch (error) {
      console.error('Error fetching registrants list:', error);
      throw error;
    }
  },
  
  // Update a registration
  updateRegistration: async (id, registrationData) => {
    try {
      const response = await apiClient.put(`/registrations/${id}`, registrationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating registration ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a registration
  deleteRegistration: async (id) => {
    try {
      await apiClient.delete(`/registrations/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting registration ${id}:`, error);
      throw error;
    }
  },
  
  // Add a registrant to a registration
  addRegistrant: async (registrationId, registrantData) => {
    try {
      const response = await apiClient.post(`/registrations/${registrationId}/registrants`, registrantData);
      return response.data;
    } catch (error) {
      console.error(`Error adding registrant to registration ${registrationId}:`, error);
      throw error;
    }
  }
};

// For backward compatibility
export const registrationService = registrationApi;