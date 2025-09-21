/**
 * BoxList Component - Enhanced table for displaying shipping boxes
 * Uses memoization and performance optimizations
 */

import React, { memo, useMemo, useCallback } from 'react';
import { useBox } from '../context/BoxContext';
import { formatCurrency } from '../utils';
import { UI_MESSAGES } from '../constants';
import BoxRow from './BoxRow';
import './BoxList.css';

const BoxList = memo(() => {
  const { boxes, statistics, loading, removeBox } = useBox();

  /**
   * Handles box removal with confirmation
   */
  const handleRemoveBox = useCallback((boxId, receiverName) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove the box for ${receiverName}?`
    );
    
    if (confirmed) {
      removeBox(boxId);
    }
  }, [removeBox]);

  /**
   * Memoized empty state component
   */
  const EmptyState = useMemo(() => (
    <div className="box-list-container">
      <div className="empty-state">
        <h2>{UI_MESSAGES.INFO.NO_BOXES}</h2>
        <p>Start by adding your first shipping box using the form.</p>
      </div>
    </div>
  ), []);

  /**
   * Memoized loading state component
   */
  const LoadingState = useMemo(() => (
    <div className="box-list-container">
      <div className="loading-state">
        <div className="spinner large" aria-hidden="true"></div>
        <p>{UI_MESSAGES.INFO.LOADING}</p>
      </div>
    </div>
  ), []);

  // Show loading state
  if (loading) {
    return LoadingState;
  }

  // Show empty state
  if (!boxes || boxes.length === 0) {
    return EmptyState;
  }

  return (
    <div className="box-list-container">
      <div className="box-list-header">
        <h2>Shipping Boxes</h2>
        <p className="box-count">
          Total boxes: {statistics.totalBoxes}
        </p>
      </div>
      
      <div className="table-container">
        <table className="box-table" role="table">
          <thead>
            <tr role="row">
              <th scope="col">Receiver Name</th>
              <th scope="col">Weight (kg)</th>
              <th scope="col">Box Color</th>
              <th scope="col">Destination Country</th>
              <th scope="col">Shipping Cost</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boxes.map((box) => (
              <BoxRow 
                key={box.id} 
                box={box} 
                onRemove={handleRemoveBox}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="summary-container">
        <div className="summary-card">
          <h3>Summary Statistics</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total Boxes:</span>
              <span className="stat-value">{statistics.totalBoxes}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Weight:</span>
              <span className="stat-value">
                {statistics.totalWeight.toFixed(2)} kg
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Cost:</span>
              <span className="stat-value">
                {formatCurrency(statistics.totalCost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BoxList.displayName = 'BoxList';

export default BoxList;
