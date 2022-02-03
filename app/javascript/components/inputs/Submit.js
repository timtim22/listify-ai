import React, { useState, useContext } from 'react';
import { UserContext } from '../listings/New';
import PropTypes from 'prop-types';
import Filter from 'bad-words';
import GeneratingSpinner from '../common/GeneratingSpinner';

const profanityFilter = new Filter();

const Submit = ({ inputText, loading, runsRemaining, userInputLength, maxUserInput, buttonText }) => {
  const user = useContext(UserContext);

  const inputLengthWarning = () => {
    const charactersOver = userInputLength - maxUserInput;
    const s = charactersOver > 1 ? 's' : '';
    const text = `Oops - that text is ${charactersOver} character${s} over the total limit.`
    return warningText(text);
  }

  const requestLimitWarning = () => {
    let text = "You've used up all your spins for this month. You can get more by upgrading your subscription. Contact us if you need any help."
    if (user.subscription_status === "on_private_beta") {
      text = "You've hit your request limit for today. Please contact us if you need help.";
    }
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
        <p className="text-sm font-semibold text-center text-red-800">
          {text}
        </p>
      </div>
    )
  }

  const submitButton = () => {
    return (
      <button disabled={loading} className={`${loading ? "cursor-not-allowed opacity-50" : ""} primary-button`}>
        {buttonText ? buttonText : 'Generate'}
      </button>
    )
  }

  if (runsRemaining < 1) { return requestLimitWarning(); }
  if (invalidInputLength()) { return inputLengthWarning(); }
  if (isProfane()) { return profanityWarning(); }
  return submitButton();

}

export default Submit;
