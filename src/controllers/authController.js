// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\controllers\authController.js
// Updated with OTP handling and Google security features

import api from '../services/api';

export const authController = {
  /**
   * Register user
   * Returns: { success, message, otp, otpExpiry, otpDuration, user }
   */
  register: async (name, email, phone, password) => {
    const res = await api.post('/auth/register', { name, email, phone, password });
    return res.data; // Contains otp, otpExpiry, otpDuration
  },

  /**
   * Verify OTP
   */
  verifyOTP: async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  /**
   * Resend OTP
   * Returns: { success, message, otp, otpExpiry, otpDuration }
   */
  resendOTP: async (email) => {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
  },

  /**
   * Login
   */
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Check if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current user
   */
  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  /**
   * Request Phone Verification OTP
   */
  requestPhoneVerify: async (phone) => {
    const res = await api.post('/auth/request-phone-verify', { phone });
    return res.data;
  },

  /**
   * Verify Phone OTP
   */
  verifyPhoneOTP: async (phone, otp) => {
    const res = await api.post('/auth/verify-phone-otp', { phone, otp });
    return res.data;
  },

  /**
   * Setup Password (Google Users)
   */
  setupPassword: async (password) => {
    const res = await api.post('/auth/setup-password', { password });
    return res.data;
  }
};