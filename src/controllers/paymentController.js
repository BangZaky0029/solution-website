// Payment controller - Frontend API abstraction

import api from '../services/api';

export const paymentController = {
  // Create payment record
  createPayment: async (packageId, paymentMethod, forceUpgrade = false) => {
    try {
      const response = await api.post('/payment/create', {
        package_id: packageId,
        method: paymentMethod,
        forceUpgrade,
      });

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Gagal membuat payment'
        };
      }

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
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Gagal mengonfirmasi pembayaran'
        };
      }

      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    const response = await api.get(`/payment/${paymentId}`);
    return response.data;
  },

  // Get user payments
  getUserPayments: async () => {
    const response = await api.get('/payment/user/payments');

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    return response.data;
  },

  // Check active package
  checkActivePackage: async () => {
    try {
      const response = await api.get('/payment/check-active-package');
      return response.data;
    } catch (error) {
      return {
        success: false,
        hasActive: false,
        message: error.response?.data?.message || 'Gagal cek paket aktif'
      };
    }
  },

  // Get user tokens
  getUserTokens: async () => {
    const response = await api.get('/users/tokens');
    return response.data.data || response.data;
  },

  // Download invoice
  downloadInvoice: async (paymentId) => {
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
  }
};