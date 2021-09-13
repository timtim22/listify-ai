import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';

const Submit = ({ inputObject, loading, runsRemaining, maxInput }) => {

  const inputLengthWarning = () => {
    const charactersOver = inputObject.input_text.length - maxInput;
    const s = charactersOver > 1 ? 's' : '';
    const text = `Oops - that text is ${charactersOver} character${s} over the limit.`
    return warningText(text);
  }

  const requestLimitWarning = () => {
    const text = "You've hit your request limit for today. This is a safety feature - contact us for help.";
    return  warningText(text);
  }

  const invalidInputLength = () => {
    return inputObject.input_text.length > maxInput;
  }

  const warningText = (text) => {
    return (
      <div className="py-2 h-9">
        <p className="text-sm text-gray-500 font-semibold">
          {text}
        </p>
      </div>
    )
  }

  const submitButton = () => {
    return (
      <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
        Generate!
      </button>
    )
  }

  if (loading) { return <Spinner />; }
  if (runsRemaining < 1) { return requestLimitWarning(); }
  if (invalidInputLength()) { return inputLengthWarning(); }
  return submitButton();
}

export default Submit;

