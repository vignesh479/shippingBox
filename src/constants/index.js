/**
 * Application Constants
 * Centralized configuration for shipping calculator
 */

export const SHIPPING_RATES = {
  SWEDEN: 7.35,
  CHINA: 11.53,
  BRAZIL: 15.63,
  AUSTRALIA: 50.09,
};

export const COUNTRIES = {
  SWEDEN: 'Sweden',
  CHINA: 'China', 
  BRAZIL: 'Brazil',
  AUSTRALIA: 'Australia',
};

export const FORM_VALIDATION = {
  MIN_WEIGHT: 0.01,
  MAX_WEIGHT: 10000,
  MAX_NAME_LENGTH: 100,
  REQUIRED_FIELDS: ['receiverName', 'weight', 'country'],
};

export const ROUTES = {
  HOME: '/',
  ADD_BOX: '/',
  BOX_LIST: '/boxes',
};

export const UI_MESSAGES = {
  ERRORS: {
    REQUIRED_FIELD: 'This field is required',
    NEGATIVE_WEIGHT: 'Weight cannot be negative',
    INVALID_WEIGHT: 'Please enter a valid weight',
    MAX_WEIGHT_EXCEEDED: `Weight cannot exceed ${FORM_VALIDATION.MAX_WEIGHT} kg`,
    NAME_TOO_LONG: `Name cannot exceed ${FORM_VALIDATION.MAX_NAME_LENGTH} characters`,
    GENERIC_ERROR: 'An unexpected error occurred',
  },
  SUCCESS: {
    BOX_ADDED: 'Box added successfully!',
    FORM_RESET: 'Form has been reset',
  },
  INFO: {
    NO_BOXES: 'No boxes have been added yet',
    LOADING: 'Loading...',
  },
};


export const DEFAULT_BOX_COLOR = '#3498db';
