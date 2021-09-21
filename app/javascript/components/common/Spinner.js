import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ color }) => {
  const spinnerColor = color || "border-green-500"
  return (
   <div className="flex justify-center items-center py-2 w-9 h-9">
     <div className={`${spinnerColor} animate-spin rounded-full h-6 w-6 border-t-2 border-b-2`}></div>
    </div>
  )
}

Spinner.propTypes = {
  color: PropTypes.string
};


export default Spinner;
