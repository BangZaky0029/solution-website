// =========================================
// FILE: paymentController.js - FRONTEND CONTROLLER FIXED
// Path: src/controllers/paymentController.js
// =========================================

import api from '../services/api';

export const paymentController = {
  // ✅ CREATE PAYMENT - Already correct
  createPayment: async (packageId, paymentMethod, forceUpgrade = false) => {
    try {
      const response = await api.post('/payment/create', {
        package_id: packageId,
        method: paymentMethod,
        forceUpgrade,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Gagal membuat payment'
        };
      }
      
      throw error;
    }
  },

  // ✅ CONFIRM PAYMENT - Already correct
  confirmPayment: async (paymentId, email, phone, proofFile) => {
    try {
      const formData = new FormData();
      formData.append('payment_id', paymentId);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('proof_image', proofFile);

      const response = await api.post('/payment/confirm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Gagal mengonfirmasi pembayaran'
        };
      }
      
      throw error;
    }
  },

  // ✅ GET PAYMENT STATUS - Already correct
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },

  // ✅ FIXED: Handle response structure properly
  getUserPayments: async () => {
    try {
      const response = await api.get('/payment/user/payments');
      
      // Backend sends { success: true, data: [...] }
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  },

  // ✅ CHECK ACTIVE PACKAGE - Already correct
  checkActivePackage: async () => {
    try {
      const response = await api.get('/payment/check-active-package');
      return response.data;
    } catch (error) {
      console.error('Error checking active package:', error);
      
      return {
        success: false,
        hasActive: false,
        message: error.response?.data?.message || 'Gagal cek paket aktif'
      };
    }
  },

  // ✅ FIXED: Handle response structure
  getUserTokens: async () => {
    try {
      const response = await api.get('/users/tokens');
      // Backend sends { success: true, data: [...] }
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error getting user tokens:', error);
      throw error;
    }
  },

  // ✅ DOWNLOAD INVOICE - Already correct
  downloadInvoice: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}/invoice`, {
        responseType: 'blob'
      });
      
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