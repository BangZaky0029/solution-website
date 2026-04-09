// src/services/statsService.js
import api from './api';

export const statsService = {
  /**
   * Track generator link click
   * @param {string} code - The feature code of the generator
   */
  trackGeneratorClick: async (code) => {
    try {
      // We use a non-blocking call
      api.post('/stats/track-generator', { code }).catch(() => {
          // Silent catch for analytics
      });
    } catch (e) {
      // Silent catch
    }
  }
};
