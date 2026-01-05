// =========================================
// FILE: src/controllers/authController.js
// =========================================

import api from '../services/api';

export const authController = {
  register: async (name, email, phone, password) => {
    const res = await api.post('/auth/register', { name, email, phone, password });
    return res.data;
  },

  verifyOTP: async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
