/**
 * Custom hook for managing notifications
 * Provides a clean API for showing success, error, and info messages
 */

import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  }, []);

  const showSuccess = useCallback((message) => {
    showNotification(message, 'success');
  }, [showNotification]);

  const showError = useCallback((message) => {
    showNotification(message, 'error');
  }, [showNotification]);

  const showWarning = useCallback((message) => {
    showNotification(message, 'warning');
  }, [showNotification]);

  const showInfo = useCallback((message) => {
    showNotification(message, 'info');
  }, [showNotification]);

  
  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const clearNotification = useCallback(() => {
    setNotification({
      message: '',
      type: 'info',
      isVisible: false,
    });
  }, []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    clearNotification,
  };
};
