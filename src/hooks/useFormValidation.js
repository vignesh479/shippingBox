/**
 * Custom hook for form validation and submission handling
 * Provides validation logic and error handling for forms
 */

import { useCallback } from 'react';

export const useFormValidation = ({
  validateForm,
  errors,
  showError,
  setIsSubmitting,
}) => {
  const validateAndShowErrors = useCallback(() => {
    const isValid = validateForm();
    
    if (!isValid) {
      // Show error message for missing required fields
      const missingFields = [];
      if (errors.receiverName) missingFields.push('Receiver Name');
      if (errors.weight) missingFields.push('Weight');
      if (errors.country) missingFields.push('Destination Country');
      
      const errorMessage = missingFields.length > 0 
        ? `Please fill in the following required fields: ${missingFields.join(', ')}`
        : 'Please correct the errors in the form before submitting.';
      
      showError(errorMessage);
      return false;
    }
    
    return true;
  }, [validateForm, errors, showError]);

  const handleFormSubmission = useCallback((submitAction, onSuccess, onError) => {
    return async (event) => {
      event.preventDefault();
      
      // Validate form first
      if (!validateAndShowErrors()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await submitAction();
        
        if (result.success) {
          onSuccess(result);
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        
        if (onError) {
          onError(error);
        } else {
          showError('An error occurred while processing your request. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [validateAndShowErrors, setIsSubmitting, showError]);


  const createFieldErrorMessage = useCallback((fieldMappings = {}) => {
    return () => {
      const missingFields = [];
      
      Object.keys(errors).forEach(fieldName => {
        if (errors[fieldName]) {
          const displayName = fieldMappings[fieldName] || fieldName;
          missingFields.push(displayName);
        }
      });
      
      if (missingFields.length > 0) {
        return `Please fill in the following required fields: ${missingFields.join(', ')}`;
      }
      
      return 'Please correct the errors in the form before submitting.';
    };
  }, [errors]);

  return {
    validateAndShowErrors,
    handleFormSubmission,
    createFieldErrorMessage,
  };
};
