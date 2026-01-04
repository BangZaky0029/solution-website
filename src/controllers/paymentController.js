// =========================================
// FILE: src/controllers/paymentController.js
// =========================================

import api from '../services/api';

export const paymentController = {
  // Create payment
  createPayment: async (packageId, paymentMethod, forceUpgrade = false) => {
    try {
      const response = await api.post('/payment/create', {
        package_id: packageId,
        method: paymentMethod,
        forceUpgrade,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Confirm payment with proof
  confirmPayment: async (paymentId, email, phone, proofFile) => {
    try {
      const formData = new FormData();
      formData.append('payment_id', paymentId);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('proof', proofFile);

      const response = await api.post('/payment/confirm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user payments
  getUserPayments: async () => {
    try {
      const response = await api.get('/payment/user/payments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Check if user has active package/trial
  checkActivePackage: async () => {
    try {
      const response = await api.get('/payment/user/active-package'); // harus sama seperti di backend
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};
