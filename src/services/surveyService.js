// =========================================
// src/services/surveyService.js
// Frontend Service for Surveys
// =========================================

import api from './api';

const surveyService = {
  /**
   * Get survey status for current user
   */
  getSurveyStatus: async () => {
    try {
      const response = await api.get('/surveys/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching survey status:', error);
      throw error;
    }
  },

  /**
   * Submit User Acquisition Source
   */
  submitAcquisition: async (source) => {
    try {
      const response = await api.post('/surveys/acquisition', { source });
      return response.data;
    } catch (error) {
      console.error('Error submitting acquisition:', error);
      throw error;
    }
  },

  /**
   * Submit or Update User Feedback
   */
  submitFeedback: async (rating, comment) => {
    try {
      const response = await api.post('/surveys/feedback', { rating, comment });
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
};

export default surveyService;
