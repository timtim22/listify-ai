import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Filter from 'bad-words';
import GeneratingSpinner from '../common/GeneratingSpinner';

const profanityFilter = new Filter();

const Submit = ({ inputText, loading, runsRemaining, userInputLength, maxUserInput }) => {

  const inputLengthWarning = () => {
    const charactersOver = userInputLength - maxUserInput;
    const s = charactersOver > 1 ? 's' : '';
    const text = `Oops - that text is ${charactersOver} character${s} over the limit.`
    return warningText(text);
  }

  const requestLimitWarning = () => {
    const text = "You've hit your request limit for today. This is a safety feature - contact us for help.";
    return  warningText(text);
  }

  const profanityWarning = () => {
    const text = "Our filters think that text might be unsafe. Please let us know if this is a mistake."
    return  warningText(text);
  }

  const isProfane = () => {
    return profanityFilter.isProfane(inputText);
  }

  const invalidInputLength = () => {
    return userInputLength > maxUserInput;
  }

  const warningText = (text) => {
    return (
      <div className="py-2 h-9">
        <p className="text-sm text-center font-semibold text-red-800">
          {text}
        </p>
      </div>
    )
  }

  const submitButton = () => {
    return (
      <button className="primary-button">
        Generate
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
