/**
 * AddBox Component - Enhanced form for adding shipping boxes
 * Uses custom hooks for form management and validation
 */

import React, { memo, useCallback } from 'react';
import { useBox, COUNTRY_MULTIPLIERS } from '../context/BoxContext';
import { useBoxForm } from '../hooks/useBoxForm';
import { useNotification } from '../hooks/useNotification';
import { useFormValidation } from '../hooks/useFormValidation';
import { UI_MESSAGES } from '../constants';
import { formatCurrency } from '../utils';
import Notification from './Notification';
import './AddBox.css';

const AddBox = memo(() => {
  const { addBox, loading, error, clearError } = useBox();
  
  const {
    notification,
    showSuccess,
    showError,
    showWarning,
    hideNotification,
  } = useNotification();
  
  // Wrap showWarning in useCallback to prevent unnecessary re-renders
  const handleNegativeWeight = useCallback((message) => {
    showWarning(message);
  }, [showWarning]);
  
  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    getSubmissionData,
    setIsSubmitting,
  } = useBoxForm(handleNegativeWeight);

  // Form validation hook
  const { handleFormSubmission } = useFormValidation({
    validateForm,
    errors,
    showError,
    setIsSubmitting,
  });

  const countries = Object.keys(COUNTRY_MULTIPLIERS);

  /**
   * Calculates estimated shipping cost in real-time
   */
  const getEstimatedCost = useCallback(() => {
    if (formData.weight && formData.country && parseFloat(formData.weight) > 0) {
      const rate = COUNTRY_MULTIPLIERS[formData.country];
      const cost = parseFloat(formData.weight) * rate;
      return formatCurrency(cost);
    }
    return null;
  }, [formData.weight, formData.country]);

  /**
   * Submission action for the form
   */
  const submitAction = useCallback(async () => {
    const submissionData = getSubmissionData();
    return await addBox(submissionData);
  }, [getSubmissionData, addBox]);

  /**
   * Success handler for form submission
   */
  const handleSuccess = useCallback((result) => {
    resetForm();
    showSuccess(result.message || UI_MESSAGES.SUCCESS.BOX_ADDED);
  }, [resetForm, showSuccess]);

  /**
   * Error handler for form submission
   */
  const handleError = useCallback((error) => {
    showError('An error occurred while saving the box. Please try again.');
  }, [showError]);

  /**
   * Handles form submission with validation
   */
  const handleSubmit = useCallback((event) => {
    clearError();
    return handleFormSubmission(submitAction, handleSuccess, handleError)(event);
  }, [clearError, handleFormSubmission, submitAction, handleSuccess, handleError]);

  const estimatedCost = getEstimatedCost();

  return (
    <div className="add-box-container">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      <div className="add-box-card">
        <h2>Add New Shipping Box</h2>
        
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-box-form" noValidate>
          <div className="form-group">
            <label htmlFor="receiverName">
              Receiver Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="receiverName"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.receiverName && touched.receiverName ? 'error' : ''}
              placeholder="Enter receiver's name"
              maxLength="100"
              autoComplete="name"
              aria-describedby={errors.receiverName ? 'receiverName-error' : undefined}
              aria-invalid={errors.receiverName && touched.receiverName}
            />
            {errors.receiverName && touched.receiverName && (
              <div 
                id="receiverName-error" 
                className="field-error" 
                role="alert"
              >
                {errors.receiverName}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="weight">
              Weight (kg) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.weight && touched.weight ? 'error' : ''}
              placeholder="Enter weight in kilograms"
              min="0.01"
              max="10000"
              step="0.01"
              aria-describedby={errors.weight ? 'weight-error' : undefined}
              aria-invalid={errors.weight && touched.weight}
            />
            {errors.weight && touched.weight && (
              <div 
                id="weight-error" 
                className="field-error" 
                role="alert"
              >
                {errors.weight}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="boxColor">Box Color</label>
            <div className="color-input-container">
              <input
                type="color"
                id="boxColor"
                name="boxColor"
                value={formData.boxColor}
                onChange={handleChange}
                className="color-picker"
                title="Select box color"
              />
              <span className="color-rgb">
                RGB: {formData.boxColor}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">
              Destination Country <span className="required">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.country && touched.country ? 'error' : ''}
              aria-describedby={errors.country ? 'country-error' : undefined}
              aria-invalid={errors.country && touched.country}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country} ({formatCurrency(COUNTRY_MULTIPLIERS[country])} per kg)
                </option>
              ))}
            </select>
            {errors.country && touched.country && (
              <div 
                id="country-error" 
                className="field-error" 
                role="alert"
              >
                {errors.country}
              </div>
            )}
          </div>

          {estimatedCost && (
            <div className="estimated-cost">
              <span className="cost-label">Estimated Cost:</span>
              <span className="cost-value">{estimatedCost}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting || loading}
            aria-describedby="submit-help"
          >
            {isSubmitting || loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Adding Box...
              </>
            ) : (
              'Add Box'
            )}
          </button>
          
          <div id="submit-help" className="form-help">
            All fields marked with * are required
          </div>
        </form>
      </div>
    </div>
  );
});

AddBox.displayName = 'AddBox';

export default AddBox;
