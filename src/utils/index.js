/**
 * Utility Functions
 * Reusable helper functions for the shipping calculator
 */

import { SHIPPING_RATES } from '../constants';

export const hexToRgb = (hex) => {
  if (!hex || typeof hex !== 'string') {
    return '(0, 0, 0)';
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  if (!result) {
    return '(0, 0, 0)';
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `(${r}, ${g}, ${b})`;
};

export const rgbToColor = (rgbString) => {
  if (!rgbString || typeof rgbString !== 'string') {
    return '#000000';
  }
  
  const matches = rgbString.match(/\((\d+),\s*(\d+),\s*(\d+)\)/);
  
  if (!matches) {
    return '#000000';
  }
  
  const [, r, g, b] = matches;
  return `rgb(${r}, ${g}, ${b})`;
};

export const calculateShippingCost = (weight, country) => {
  if (!weight || !country || weight <= 0) {
    return 0;
  }

  const countryKey = country.toUpperCase();
  const rate = SHIPPING_RATES[countryKey];
  
  if (!rate) {
    throw new Error(`Shipping rate not found for country: ${country}`);
  }

  return parseFloat((weight * rate).toFixed(2));
};

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0.00';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const validateBoxForm = (formData) => {
  const errors = {};

  // Receiver name validation
  if (!formData.receiverName?.trim()) {
    errors.receiverName = 'Receiver name is required. Please enter the recipient\'s name.';
  } else if (formData.receiverName.trim().length > 100) {
    errors.receiverName = 'Receiver name cannot exceed 100 characters.';
  }

  // Weight validation
  if (!formData.weight || formData.weight === '') {
    errors.weight = 'Weight is required. Please enter the package weight in kilograms.';
  } else {
    const weight = parseFloat(formData.weight);
    if (isNaN(weight)) {
      errors.weight = 'Please enter a valid numeric weight value.';
    } else if (weight < 0) {
      errors.weight = 'Negative values are not permitted for weight.';
    } else if (weight === 0) {
      errors.weight = 'Weight must be greater than 0 kg.';
    } else if (weight > 10000) {
      errors.weight = 'Weight cannot exceed 10,000 kg. Please check the weight.';
    }
  }

  // Country validation
  if (!formData.country) {
    errors.country = 'Destination country is required. Please select a shipping destination.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const debounce = (func, delay) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const generateId = () => {
  return `box_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

