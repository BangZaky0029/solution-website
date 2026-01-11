// =========================================
// FILE: src/services/passwordService.js - NEW
// Password Reset API Service
// =========================================

import api from './api';

export const passwordService = {
  /**
   * Request password reset (send OTP to WhatsApp)
   */
  requestReset: async (phone) => {
    try {
      const response = await api.post('/password/forgot', { phone });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify reset OTP
   */
  verifyResetOTP: async (phone, otp) => {
    try {
      const response = await api.post('/password/verify-reset-otp', { 
        phone, 
        otp 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password
   */
  resetPassword: async (phone, newPassword) => {
    try {
      const response = await api.post('/password/reset', { 
        phone, 
        newPassword 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resend reset OTP
   */
  resendResetOTP: async (phone) => {
    try {
      const response = await api.post('/password/resend-otp', { phone });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};