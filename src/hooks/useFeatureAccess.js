// Custom Hook for Feature Access Management

import { useState, useEffect } from 'react';
import { featureAccessService } from '../services/featureAccessService';
import { useAuth } from './useAuth';

/**
 * Custom hook untuk manage akses fitur user
 * @returns {Object} Feature access state dan methods
 */
export const useFeatureAccess = () => {
  const { isAuthenticated } = useAuth();

  const [accessStatus, setAccessStatus] = useState({});
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch access details
  useEffect(() => {
    const fetchAccessDetails = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [status, details] = await Promise.all([
          featureAccessService.getFeatureAccessStatus(),
          featureAccessService.getFeatureAccessDetails()
        ]);

        setAccessStatus(status || {});
        setPackageInfo(details || null);
      } catch (err) {
        setError(err.message);
        setAccessStatus({});
        setPackageInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessDetails();
  }, [isAuthenticated]);

  // Get feature status
  const getStatus = (featureCode) => {
    if (!isAuthenticated) return 'locked';
    if (loading) return 'loading';
    return accessStatus[featureCode] || 'premium';
  };

  // Check if can access
  const canAccess = (featureCode) => {
    const status = getStatus(featureCode);
    return status === 'free' || status === 'subscribed';
  };

  // Get accessible features
  const getAccessibleFeatures = () => {
    return Object.entries(accessStatus)
      .filter(([_, status]) => status === 'free' || status === 'subscribed')
      .map(([code, _]) => code);
  };

  // Refetch
  const refetch = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const [status, details] = await Promise.all([
        featureAccessService.getFeatureAccessStatus(),
        featureAccessService.getFeatureAccessDetails()
      ]);

      setAccessStatus(status || {});
      setPackageInfo(details || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    accessStatus,
    packageInfo,
    loading,
    error,
    getStatus,
    canAccess,
    getAccessibleFeatures,
    refetch,
    isAuthenticated
  };
};