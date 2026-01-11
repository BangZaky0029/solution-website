// =========================================
// FILE: src/controllers/userController.js - FIXED
// =========================================

import api from '../services/api';

export const userController = {
  // ✅ FIXED: Handle response structure properly
  getProfile: async () => {
    try {
      const response = await api.get('/users/me');
      // Backend sends { success: true, data: {...} }
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ FIXED: Handle response structure
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ FIXED: Handle response structure
  getUserTokens: async () => {
    try {
      const response = await api.get('/users/tokens');
      // Backend sends { success: true, data: [...] }
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ FIXED: Handle response structure
  getSubscriptionStatus: async () => {
    try {
      const response = await api.get('/users/subscription-status');
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },
};