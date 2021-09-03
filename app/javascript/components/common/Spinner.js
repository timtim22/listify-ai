import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ color }) => {
  const spinnerColor = color || "green-500"
  return (
   <div className="flex justify-center items-center h-9 w-9 py-2">
     <div className={`border-${spinnerColor} animate-spin rounded-full h-6 w-6 border-t-2 border-b-2`}></div>
    </div>
  )
}

Spinner.propTypes = {
  color: PropTypes.string
};


export default Spinner;
