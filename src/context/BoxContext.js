/**
 * Box Context - Enhanced version with better error handling
 * Manages global state for shipping boxes using Context API and useReducer
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { calculateShippingCost, generateId } from '../utils';
import { SHIPPING_RATES, UI_MESSAGES } from '../constants';

// Export shipping rates for components to use
export const COUNTRY_MULTIPLIERS = SHIPPING_RATES;

// Initial state with better structure
const createInitialState = () => ({
  boxes: [],
  loading: false,
  error: null,
  statistics: {
    totalBoxes: 0,
    totalWeight: 0,
    totalCost: 0,
  },
});

// Action types using constants
const ActionTypes = {
  LOAD_BOXES: 'LOAD_BOXES',
  ADD_BOX: 'ADD_BOX',
  REMOVE_BOX: 'REMOVE_BOX',
  UPDATE_BOX: 'UPDATE_BOX',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_STATISTICS: 'UPDATE_STATISTICS',
};

/**
 * Calculates statistics from boxes array
 * @param {Array} boxes - Array of box objects
 * @returns {Object} Statistics object
 */
const calculateStatistics = (boxes) => {
  if (!Array.isArray(boxes) || boxes.length === 0) {
    return { totalBoxes: 0, totalWeight: 0, totalCost: 0 };
  }

  return boxes.reduce(
    (stats, box) => ({
      totalBoxes: stats.totalBoxes + 1,
      totalWeight: stats.totalWeight + (box.weight || 0),
      totalCost: stats.totalCost + (box.shippingCost || 0),
    }),
    { totalBoxes: 0, totalWeight: 0, totalCost: 0 }
  );
};

// Enhanced reducer with better error handling
const boxReducer = (state, action) => {
  try {
    switch (action.type) {
      case ActionTypes.LOAD_BOXES: {
        const boxes = action.payload || [];
        return {
          ...state,
          boxes,
          statistics: calculateStatistics(boxes),
          loading: false,
          error: null,
        };
      }

      case ActionTypes.ADD_BOX: {
        const newBoxes = [...state.boxes, action.payload];
        return {
          ...state,
          boxes: newBoxes,
          statistics: calculateStatistics(newBoxes),
          error: null,
          loading: false,
        };
      }

      case ActionTypes.REMOVE_BOX: {
        const newBoxes = state.boxes.filter(box => box.id !== action.payload);
        return {
          ...state,
          boxes: newBoxes,
          statistics: calculateStatistics(newBoxes),
          error: null,
        };
      }

      case ActionTypes.UPDATE_BOX: {
        const newBoxes = state.boxes.map(box =>
          box.id === action.payload.id ? { ...box, ...action.payload.updates } : box
        );
        return {
          ...state,
          boxes: newBoxes,
          statistics: calculateStatistics(newBoxes),
          error: null,
        };
      }

      case ActionTypes.SET_LOADING:
        return {
          ...state,
          loading: action.payload,
        };

      case ActionTypes.SET_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false,
        };

      case ActionTypes.CLEAR_ERROR:
        return {
          ...state,
          error: null,
        };

      case ActionTypes.UPDATE_STATISTICS:
        return {
          ...state,
          statistics: calculateStatistics(state.boxes),
        };

      default:
        console.warn(`Unknown action type: ${action.type}`);
        return state;
    }
  } catch (error) {
    console.error('Error in boxReducer:', error);
    return {
      ...state,
      error: UI_MESSAGES.ERRORS.GENERIC_ERROR,
      loading: false,
    };
  }
};

// Create context
const BoxContext = createContext();

/**
 * Enhanced Box Provider with better error handling and persistence
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const BoxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(boxReducer, createInitialState());


  /**
   * Adds a new box with enhanced error handling
   * @param {Object} boxData - Box data object
   * @returns {Object} Result object with success status
   */
  const addBox = useCallback(async (boxData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      // Validate input data
      if (!boxData || typeof boxData !== 'object') {
        throw new Error('Invalid box data provided');
      }

      // Calculate shipping cost using utility function
      const shippingCost = calculateShippingCost(boxData.weight, boxData.country);
      
      const boxWithDetails = {
        ...boxData,
        id: generateId(),
        shippingCost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate async operation (could be API call in real app)
      await new Promise(resolve => setTimeout(resolve, 100));

      dispatch({ type: ActionTypes.ADD_BOX, payload: boxWithDetails });
      
      return { 
        success: true, 
        message: UI_MESSAGES.SUCCESS.BOX_ADDED,
        boxId: boxWithDetails.id 
      };
    } catch (error) {
      const errorMessage = error.message || UI_MESSAGES.ERRORS.GENERIC_ERROR;
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);

  /**
   * Removes a box by ID
   * @param {string} boxId - Box ID to remove
   * @returns {Object} Result object
   */
  const removeBox = useCallback((boxId) => {
    try {
      if (!boxId) {
        throw new Error('Box ID is required');
      }

      dispatch({ type: ActionTypes.REMOVE_BOX, payload: boxId });
      
      return { 
        success: true, 
        message: 'Box removed successfully' 
      };
    } catch (error) {
      const errorMessage = error.message || UI_MESSAGES.ERRORS.GENERIC_ERROR;
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);

  /**
   * Updates an existing box
   * @param {string} boxId - Box ID to update
   * @param {Object} updates - Updates to apply
   * @returns {Object} Result object
   */
  const updateBox = useCallback((boxId, updates) => {
    try {
      if (!boxId || !updates) {
        throw new Error('Box ID and updates are required');
      }

      // Recalculate shipping cost if weight or country changed
      if (updates.weight !== undefined || updates.country !== undefined) {
        const box = state.boxes.find(b => b.id === boxId);
        if (box) {
          const newWeight = updates.weight !== undefined ? updates.weight : box.weight;
          const newCountry = updates.country !== undefined ? updates.country : box.country;
          updates.shippingCost = calculateShippingCost(newWeight, newCountry);
        }
      }

      updates.updatedAt = new Date().toISOString();

      dispatch({ 
        type: ActionTypes.UPDATE_BOX, 
        payload: { id: boxId, updates } 
      });
      
      return { 
        success: true, 
        message: 'Box updated successfully' 
      };
    } catch (error) {
      const errorMessage = error.message || UI_MESSAGES.ERRORS.GENERIC_ERROR;
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [state.boxes]);

  /**
   * Gets all boxes (memoized for performance)
   */
  const getBoxes = useCallback(() => {
    return state.boxes;
  }, [state.boxes]);

  /**
   * Clears current error
   */
  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  /**
   * Refreshes statistics
   */
  const refreshStatistics = useCallback(() => {
    dispatch({ type: ActionTypes.UPDATE_STATISTICS });
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    // State
    boxes: state.boxes,
    loading: state.loading,
    error: state.error,
    statistics: state.statistics,
    
    // Actions
    addBox,
    removeBox,
    updateBox,
    getBoxes,
    clearError,
    refreshStatistics,
    
    // Utilities
    calculateShippingCost: (weight, country) => calculateShippingCost(weight, country),
  }), [
    state.boxes,
    state.loading,
    state.error,
    state.statistics,
    addBox,
    removeBox,
    updateBox,
    getBoxes,
    clearError,
    refreshStatistics,
  ]);

  return (
    <BoxContext.Provider value={contextValue}>
      {children}
    </BoxContext.Provider>
  );
};

// Custom hook to use context
export const useBox = () => {
  const context = useContext(BoxContext);
  if (!context) {
    throw new Error('useBox must be used within a BoxProvider');
  }
  return context;
};

export default BoxContext;
