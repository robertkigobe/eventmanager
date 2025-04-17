import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Registration services
export const registrationService = {
  // Get paginated list of registrations
  getRegistrations: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/registrations?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  },

  // Get a single registration with all registrants
  getRegistration: async (registrationId) => {
    try {
      const response = await api.get(`/registrations/${registrationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registration ${registrationId}:`, error);
      throw error;
    }
  },

  // Create a new registration
  createRegistration: async (registrationData) => {
    try {
      const response = await api.post('/registrations/', registrationData);
      return response.data;
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  },

  // Get registrants for a specific registration
  getRegistrantsByRegistration: async (registrationId, page = 1, perPage = 10) => {
    try {
      const response = await api.get(
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
      const response = await api.post('/registrations/registrants/', registrantData);
      return response.data;
    } catch (error) {
      console.error('Error creating registrant:', error);
      throw error;
    }
  },

  // Get a single registrant
  getRegistrant: async (registrantId) => {
    try {
      const response = await api.get(`/registrations/registrants/${registrantId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching registrant ${registrantId}:`, error);
      throw error;
    }
  },

  // Update a registrant
  updateRegistrant: async (registrantId, registrantData) => {
    try {
      const response = await api.put(`/registrations/registrants/${registrantId}`, registrantData);
      return response.data;
    } catch (error) {
      console.error(`Error updating registrant ${registrantId}:`, error);
      throw error;
    }
  },

  // Delete a registrant
  deleteRegistrant: async (registrantId) => {
    try {
      await api.delete(`/registrations/registrants/${registrantId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting registrant ${registrantId}:`, error);
      throw error;
    }
  }
};
