// =========================================
// FILE: src/services/featureAccessService.js - NEW
// Feature Access Management Service
// =========================================

import api from './api';

/**
 * Service untuk manage akses fitur berdasarkan paket user
 */
export const featureAccessService = {
  /**
   * Get list fitur yang bisa diakses user
   * @returns {Promise<Array>} Array of accessible features
   */
  getAccessibleFeatures: async () => {
    try {
      const response = await api.get('/users/accessible-features');
      return response.data;
    } catch (error) {
      console.error('Error getting accessible features:', error);
      return [];
    }
  },

  /**
   * Check apakah user bisa akses fitur tertentu
   * @param {string} featureCode - Kode fitur (contoh: 'generator-surat-kuasa')
   * @returns {Promise<boolean>}
   */
  canAccessFeature: async (featureCode) => {
    try {
      const response = await api.post('/users/check-feature-access', {
        feature_code: featureCode
      });
      return response.data.allowed;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  },

  /**
   * Get detail akses fitur user
   * @returns {Promise<Object>} Object dengan informasi akses fitur
   */
  getFeatureAccessDetails: async () => {
    try {
      const response = await api.get('/users/feature-access-details');
      return response.data;
    } catch (error) {
      console.error('Error getting feature access details:', error);
      return {
        package_name: '',
        active_features: [],
        expired_at: null
      };
    }
  },

  /**
   * Get status akses untuk semua fitur
   * @returns {Promise<Object>} Map dari feature_code ke status akses
   */
  getFeatureAccessStatus: async () => {
    try {
      const response = await api.get('/users/feature-access-status');
      return response.data || {};
    } catch (error) {
      console.error('Error getting feature access status:', error);
      return {};
    }
  }
};