import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RequestCounter = ({ runsRemaining }) => {
  if (runsRemaining) {
    const count = runsRemaining;
    const s = count !== 1 ? 's' : '';
    const countColor = count > 5 ? "text-green-600" : "text-red-600";
    return (
      <p className="mt-4 text-sm text-gray-500">
        You have
      <span className={`${countColor} font-extrabold`}> {count} request{s} </span>
        remaining today.
      </p>
    )
  }
}

export default RequestCounter;
