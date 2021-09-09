import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';

const Submit = ({ inputObject, loading, runsRemaining, maxInput }) => {

  const inputLengthWarning = () => {
    const charactersOver = inputObject.input_text.length - maxInput;
    const s = charactersOver > 1 ? 's' : '';
    return (
      <div className="py-2 h-9">
        <p className="text-sm text-gray-500 font-semibold">
          Oops - that text is {charactersOver} character{s} over the limit.
        </p>
      </div>
    )
  }

  const requestLimitWarning = () => {
    return (
      <div className="py-2 h-9 text-center">
        <p className="text-sm text-gray-500 font-semibold">
          You've hit your request limit for today. This is a safety feature - contact us for help.
        </p>
      </div>
    )
  }

  const invalidInputLength = () => {
    return inputObject.input_text.length > maxInput;
  }

  if (loading) { return <Spinner />; }
  if (invalidInputLength()) { return inputLengthWarning()}
  if (runsRemaining < 1) { return requestLimitWarning()}
  return (
    <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
      Generate!
    </button>
  )
}

export default Submit;

