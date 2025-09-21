/**
 * Notification Component
 * Displays success and error messages within the app
 */

import React, { memo, useEffect } from 'react';
import './Notification.css';

const Notification = memo(({ 
  message, 
  type = 'info', 
  isVisible = false, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (isVisible && onClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible || !message) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'notification-visible' : ''}`}>
      <div className="notification-content">
        <span className="notification-icon" aria-hidden="true">
          {getIcon()}
        </span>
        <span className="notification-message">{message}</span>
        {onClose && (
          <button 
            className="notification-close"
            onClick={onClose}
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
});

Notification.displayName = 'Notification';

export default Notification;
