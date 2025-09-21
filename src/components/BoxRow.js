/**
 * BoxRow Component - Individual table row for displaying a shipping box
 * Memoized for performance optimization
 */

import React, { memo, useCallback } from 'react';
import { rgbToColor, formatCurrency } from '../utils';
import './BoxRow.css';

const BoxRow = memo(({ box, onRemove }) => {
  const handleRemove = useCallback(() => {
    onRemove(box.id, box.receiverName);
  }, [box.id, box.receiverName, onRemove]);

  return (
    <tr className="box-row" role="row">
      <td className="receiver-name">{box.receiverName}</td>
      <td className="weight">{box.weight} kg</td>
      <td className="box-color">
        <div className="color-display-container">
          <div 
            className="color-box"
            style={{ backgroundColor: rgbToColor(box.boxColor) }}
            title={`RGB: ${box.boxColor}`}
            aria-label={`Box color: ${box.boxColor}`}
          ></div>
          <span className="color-rgb-text">{box.boxColor}</span>
        </div>
      </td>
      <td className="country">{box.country}</td>
      <td className="shipping-cost">
        {formatCurrency(box.shippingCost)}
      </td>
      <td className="actions">
        <button
          onClick={handleRemove}
          className="remove-button"
          title={`Remove box for ${box.receiverName}`}
          aria-label={`Remove box for ${box.receiverName}`}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
});

BoxRow.displayName = 'BoxRow';

export default BoxRow;
