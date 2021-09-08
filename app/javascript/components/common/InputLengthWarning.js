import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputLengthWarning = ({ input, maxInput }) => {
  const charactersOver = input.length - maxInput;
  const s = charactersOver > 1 ? 's' : '';
  return (
    <div className="py-2 h-9">
      <p className="text-sm text-gray-500 font-semibold">
        Oops - that text is {charactersOver} character{s} over the limit.
      </p>
    </div>
  )
}

InputLengthWarning.propTypes = {
  input: PropTypes.string,
  maxInput: PropTypes.number
};


export default InputLengthWarning;

