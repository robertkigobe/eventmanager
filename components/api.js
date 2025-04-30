import axios from 'axios';
import { auth } from '../firebase';

// Base URL of your backend API
const API_URL = 'https://your-backend-api.com'; // Replace with your actual API URL

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if user is logged in
apiClient.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Registration API functions
export const registrationApi = {
  // Create a new registration
  createRegistration: async (registrationData) => {
    try {
      const response = await apiClient.post('/registrations/', registrationData);
      return response.data;
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  },
  
  // Get all registrations
  getRegistrations: async () => {
    try {
      const response = await apiClient.get('/bbnac25/registrants/');
      return response.data;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  },
  
  // Get a specific registration by ID
  getRegistration: async (id) => {
    try {
      const response = await apiClient.get(`/registrations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registration ${id}:`, error);
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
  
  // Get registrants for a specific registration
  getRegistrants: async (registrationId) => {
    try {
      const response = await apiClient.get(`/registrations/${registrationId}/registrants`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registrants for registration ${registrationId}:`, error);
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
  },
  
  // Update a registrant
  updateRegistrant: async (registrantId, registrantData) => {
    try {
      const response = await apiClient.put(`/registrants/${registrantId}`, registrantData);
      return response.data;
    } catch (error) {
      console.error(`Error updating registrant ${registrantId}:`, error);
      throw error;
    }
  },
  
  // Delete a registrant
  deleteRegistrant: async (registrantId) => {
    try {
      await apiClient.delete(`/registrants/${registrantId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting registrant ${registrantId}:`, error);
      throw error;
    }
  },
};
