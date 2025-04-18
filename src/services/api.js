import axios from 'axios'
import RegistrationDetailsScreen from '../screens/RegistrationDetailsScreen'; // Adjust path as needed

// Base URL of your backend API
const API_URL = 'https://bbnac-app-backend.onrender.com'; // Replace with your actual API URL

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Registration API functions
export const registrationApi = {
  // Create a new registration
  createRegistration: async (registrationData) => {
    try {
      const response = await apiClient.post('/registrations/', registrationData)
      return response.data
    } catch (error) {
      console.error('Error creating registration:', error)
      throw error
    }
  },
  
  // Get all registrations
  getRegistrations: async () => {
    try {
      const response = await apiClient.get('/registrations/');
      console.log('Raw API response:', response);
      
      // Make sure we're returning the data array, not the whole response
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Some APIs wrap the array in a data property
        return Array.isArray(response.data.data) ? response.data.data : [];
      } else {
        console.error('Unexpected API response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      throw error
    }
  },
  
  // Get a specific registration by ID
  getRegistration: async (id) => {
    try {
      const response = await apiClient.get(`/registrations/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching registration ${id}:`, error)
      throw error
    }
  },
  
  // Update a registration
  updateRegistration: async (id, registrationData) => {
    try {
      const response = await apiClient.put(`/registrations/${id}`, registrationData)
      return response.data
    } catch (error) {
      console.error(`Error updating registration ${id}:`, error)
      throw error
    }
  },
  
  // Delete a registration
  deleteRegistration: async (id) => {
    try {
      await apiClient.delete(`/registrations/${id}`)
      return true
    } catch (error) {
      console.error(`Error deleting registration ${id}:`, error)
      throw error
    }
  },
  
  // Get registrants for a specific registration
  getRegistrants: async (registrationId) => {
    try {
      const response = await apiClient.get(`/registrations/${registrationId}/registrants`)
      return response.data
    } catch (error) {
      console.error(`Error fetching registrants for registration ${registrationId}:`, error)
      throw error
    }
  },
  
  // Add a registrant to a registration
  addRegistrant: async (registrationId, registrantData) => {
    try {
      const response = await apiClient.post(`/registrations/${registrationId}/registrants`, registrantData)
      return response.data
    } catch (error) {
      console.error(`Error adding registrant to registration ${registrationId}:`, error)
      throw error
    }
  },
  
  // Update a registrant
  updateRegistrant: async (registrantId, registrantData) => {
    try {
      const response = await apiClient.put(`/registrants/${registrantId}`, registrantData)
      return response.data
    } catch (error) {
      console.error(`Error updating registrant ${registrantId}:`, error)
      throw error
    }
  },
  
  // Delete a registrant
  deleteRegistrant: async (registrantId) => {
    try {
      await apiClient.delete(`/registrants/${registrantId}`)
      return true
    } catch (error) {
      console.error(`Error deleting registrant ${registrantId}:`, error)
      throw error
    }
  },
}