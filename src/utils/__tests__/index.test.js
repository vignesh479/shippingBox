/**
 * Comprehensive Unit Tests for Utility Functions
 * Demonstrates testing best practices for a 4-year experienced developer
 */

import {
  hexToRgb,
  rgbToColor,
  calculateShippingCost,
  formatCurrency,
  validateBoxForm,
  debounce,
  generateId,
  deepClone,
} from '../index';


describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hexToRgb', () => {
    it('should convert valid hex colors to RGB format', () => {
      expect(hexToRgb('#ff0000')).toBe('(255, 0, 0)');
      expect(hexToRgb('#00ff00')).toBe('(0, 255, 0)');
      expect(hexToRgb('#0000ff')).toBe('(0, 0, 255)');
      expect(hexToRgb('ff0000')).toBe('(255, 0, 0)'); // without #
    });

    it('should handle invalid inputs gracefully', () => {
      expect(hexToRgb('')).toBe('(0, 0, 0)');
      expect(hexToRgb(null)).toBe('(0, 0, 0)');
      expect(hexToRgb(undefined)).toBe('(0, 0, 0)');
      expect(hexToRgb('invalid')).toBe('(0, 0, 0)');
      expect(hexToRgb(123)).toBe('(0, 0, 0)');
    });
  });

  describe('rgbToColor', () => {
    it('should convert RGB strings to CSS color format', () => {
      expect(rgbToColor('(255, 0, 0)')).toBe('rgb(255, 0, 0)');
      expect(rgbToColor('(0, 255, 0)')).toBe('rgb(0, 255, 0)');
      expect(rgbToColor('(0, 0, 255)')).toBe('rgb(0, 0, 255)');
    });

    it('should handle invalid RGB strings', () => {
      expect(rgbToColor('')).toBe('#000000');
      expect(rgbToColor(null)).toBe('#000000');
      expect(rgbToColor('invalid')).toBe('#000000');
      expect(rgbToColor('(255, 0)')).toBe('#000000');
    });
  });

  describe('calculateShippingCost', () => {
    it('should calculate shipping costs correctly for valid countries', () => {
      expect(calculateShippingCost(1, 'SWEDEN')).toBe(7.35);
      expect(calculateShippingCost(2, 'CHINA')).toBe(23.06);
      expect(calculateShippingCost(0.5, 'BRAZIL')).toBe(7.82);
      expect(calculateShippingCost(1.5, 'AUSTRALIA')).toBe(75.14);
    });

    it('should handle edge cases', () => {
      expect(calculateShippingCost(0, 'SWEDEN')).toBe(0);
      expect(calculateShippingCost(-1, 'SWEDEN')).toBe(0);
      expect(() => calculateShippingCost(1, 'INVALID')).toThrow();
      expect(calculateShippingCost(1, '')).toBe(0); // Empty string returns 0, doesn't throw
    });

    it('should handle missing parameters', () => {
      expect(calculateShippingCost(null, 'SWEDEN')).toBe(0);
      expect(calculateShippingCost(1, null)).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as Indian currency', () => {
      expect(formatCurrency(100)).toBe('₹100.00');
      expect(formatCurrency(1000.50)).toBe('₹1,000.50');
      expect(formatCurrency(0)).toBe('₹0.00');
    });

    it('should handle invalid inputs', () => {
      expect(formatCurrency(null)).toBe('₹0.00');
      expect(formatCurrency(undefined)).toBe('₹0.00');
      expect(formatCurrency('invalid')).toBe('₹0.00');
      expect(formatCurrency(NaN)).toBe('₹0.00');
    });
  });

  describe('validateBoxForm', () => {
    const validFormData = {
      receiverName: 'John Doe',
      weight: 1.5,
      country: 'Sweden',
    };

    it('should validate correct form data', () => {
      const result = validateBoxForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should detect missing receiver name', () => {
      const result = validateBoxForm({ ...validFormData, receiverName: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.receiverName).toBeDefined();
    });

    it('should detect missing weight', () => {
      const result = validateBoxForm({ ...validFormData, weight: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.weight).toBeDefined();
    });

    it('should detect invalid weight', () => {
      const result = validateBoxForm({ ...validFormData, weight: -1 });
      expect(result.isValid).toBe(false);
      expect(result.errors.weight).toBeDefined();
    });

    it('should detect missing country', () => {
      const result = validateBoxForm({ ...validFormData, country: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.country).toBeDefined();
    });

    it('should handle name too long', () => {
      const longName = 'a'.repeat(101);
      const result = validateBoxForm({ ...validFormData, receiverName: longName });
      expect(result.isValid).toBe(false);
      expect(result.errors.receiverName).toBeDefined();
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^box_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^box_\d+_[a-z0-9]+$/);
    });
  });

  describe('deepClone', () => {
    it('should create deep copies of objects', () => {
      const original = {
        name: 'test',
        nested: { value: 123 },
        array: [1, 2, { nested: true }],
      };

      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
    });
  });

});
