/**
 * Custom hook for managing box form state and validation
 */

import { useState, useCallback, useMemo } from 'react';
import { validateBoxForm, hexToRgb } from '../utils';
import { DEFAULT_BOX_COLOR } from '../constants';

const initialFormState = {
  receiverName: '',
  weight: '',
  boxColor: DEFAULT_BOX_COLOR,
  country: '',
};

export const useBoxForm = (onNegativeWeight) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});


  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    
    // Special handling for weight field
    if (name === 'weight') {
      const numericValue = parseFloat(value);
      
      // Check for negative values
      if (value !== '' && !isNaN(numericValue) && numericValue < 0) {
        setErrors(prev => ({
          ...prev,
          weight: 'Negative values are not permitted. Weight has been set to 0.',
        }));
        setFormData(prev => ({ ...prev, [name]: '0' }));
        
        // Show notification for negative weight
        if (onNegativeWeight) {
          onNegativeWeight('Negative values are not permitted for weight. The field has been reset to 0.');
        }
        return;
      } else if (value !== '' && !isNaN(numericValue) && numericValue >= 0) {
        // Clear weight error when valid positive value is entered
        setErrors(prev => ({ ...prev, weight: '' }));
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing (except for weight which is handled above)
    if (name !== 'weight' && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors, onNegativeWeight]);


  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate single field
    const validation = validateBoxForm(formData);
    if (validation.errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validation.errors[name] }));
    }
  }, [formData]);


  const validateForm = useCallback(() => {
    const validation = validateBoxForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  const getSubmissionData = useCallback(() => {
    return {
      receiverName: formData.receiverName.trim(),
      weight: parseFloat(formData.weight),
      boxColor: hexToRgb(formData.boxColor),
      country: formData.country,
    };
  }, [formData]);

  const isFormValid = useMemo(() => {
    return validateBoxForm(formData).isValid;
  }, [formData]);

  const hasErrors = useMemo(() => {
    return Object.keys(errors).some(key => errors[key]);
  }, [errors]);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    isFormValid,
    hasErrors,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    getSubmissionData,
    setIsSubmitting,
    setErrors,
  };
};
