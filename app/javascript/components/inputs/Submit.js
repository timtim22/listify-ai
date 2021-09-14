import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Filter from 'bad-words';
import GeneratingSpinner from '../common/GeneratingSpinner';

const profanityFilter = new Filter();

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

  const profanityWarning = () => {
    const text = "Our filters think that text might be unsafe. Please let us know if this is a false positive."
    return  warningText(text);
  }

  const isProfane = () => {
    return profanityFilter.isProfane(inputObject.input_text);
  }

  const invalidInputLength = () => {
    return inputObject.input_text.length > maxInput;
  }

  const warningText = (text) => {
    return (
      <div className="py-2 h-9">
        <p className="text-sm font-semibold text-gray-500">
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

  if (loading) { return <GeneratingSpinner />; }
  if (runsRemaining < 1) { return requestLimitWarning(); }
  if (invalidInputLength()) { return inputLengthWarning(); }
  if (isProfane()) { return profanityWarning(); }
  return submitButton();
}

export default Submit;

