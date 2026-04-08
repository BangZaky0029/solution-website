// =========================================
// src/components/surveys/SurveyInterceptor.jsx
// Logic to intercept and show surveys
// =========================================

import React, { useState, useEffect } from 'react';
import AcquisitionModal from './AcquisitionModal';
import surveyService from '../../services/surveyService';

const SurveyInterceptor = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const maxSkip = 3;

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // 1. Get status from server
        const response = await surveyService.getSurveyStatus();
        
        if (response.success && !response.data.hasFilledAcquisition) {
          // 2. Get local skip count
          const localSkip = parseInt(localStorage.getItem('survey_skip_count') || '0');
          setSkipCount(localSkip);

          // 3. Show modal
          setShowModal(true);
        }
      } catch (error) {
        console.error('Failed to check survey status', error);
      } finally {
        setIsLoaded(true);
      }
    };

    checkStatus();
  }, []);

  const handleClose = () => {
    if (skipCount < maxSkip) {
      const newSkip = skipCount + 1;
      setSkipCount(newSkip);
      localStorage.setItem('survey_skip_count', newSkip.toString());
      setShowModal(false);
    } else {
      // If reached max skip, we don't allow closing unless forced by logic 
      // which is already handled inside the modal (no close button)
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    localStorage.setItem('survey_completed', 'true');
    alert('Terima kasih! Informasi Anda sangat membantu kami berkembang.');
  };


  if (!isLoaded) return children;

  return (
    <>
      {children}
      <AcquisitionModal 
        isOpen={showModal} 
        onClose={handleClose} 
        onSuccess={handleSuccess}
        skipCount={skipCount}
        maxSkip={maxSkip}
      />
    </>
  );
};

export default SurveyInterceptor;
