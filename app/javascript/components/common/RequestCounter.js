import React from 'react';
import PropTypes from 'prop-types';

const RequestCounter = ({ runsRemaining }) => {
  if (runsRemaining && runsRemaining <= 5) {
    const count = runsRemaining;
    const s = count !== 1 ? 's' : '';
    return (
      <p className="mt-4 text-sm tracking-wider text-gray-700">
        You have
        <span className="text-red-600 font-bold"> {count > 0 ? count : 0} spin{s} </span>
        remaining. Contact us if you need help.
      </p>
    )
  } else {
    return null;
  }
}

RequestCounter.propTypes = {
  runsRemaining: PropTypes.number
}

export default RequestCounter;
