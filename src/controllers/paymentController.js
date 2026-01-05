// =========================================
// FILE: paymentController.js - FRONTEND CONTROLLER FIXED
// Path: src/controllers/paymentController.js
// =========================================

import api from '../services/api';

export const paymentController = {
  // ✅ CREATE PAYMENT - FIXED
  createPayment: async (packageId, paymentMethod, forceUpgrade = false) => {
    try {
      const response = await api.post('/payment/create', {
        package_id: packageId,
        method: paymentMethod,
        forceUpgrade,
      });

      // Backend sekarang selalu kirim success flag
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      
      // Handle error response
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Gagal membuat payment'
        };
      }
      
      throw error;
    }
  },

  // ✅ CONFIRM PAYMENT - FIXED
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

      // Backend sekarang selalu kirim success flag
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      // Handle error response
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Gagal mengonfirmasi pembayaran'
        };
      }
      
      throw error;
    }
  },

  // ✅ GET PAYMENT STATUS
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },

  // ✅ GET USER PAYMENTS
  getUserPayments: async () => {
    try {
      const response = await api.get('/payment/user/payments');
      
      // Handle response structure
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  },

  // ✅ CHECK ACTIVE PACKAGE - FIXED
  // Frontend sudah benar, backend endpoint sudah difix
  checkActivePackage: async () => {
    try {
      const response = await api.get('/payment/check-active-package');
      return response.data;
    } catch (error) {
      console.error('Error checking active package:', error);
      
      // Return default response jika error
      return {
        success: false,
        hasActive: false,
        message: error.response?.data?.message || 'Gagal cek paket aktif'
      };
    }
  },

  // ✅ GET USER TOKENS
  getUserTokens: async () => {
    try {
      const response = await api.get('/users/tokens');
      return response.data;
    } catch (error) {
      console.error('Error getting user tokens:', error);
      throw error;
    }
  },

  // ✅ DOWNLOAD INVOICE
  downloadInvoice: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}/invoice`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }
};