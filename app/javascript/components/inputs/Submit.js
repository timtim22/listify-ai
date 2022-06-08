import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../listings/New';
import Filter from 'bad-words';

const profanityFilter = new Filter();
profanityFilter.removeWords('spac');

const Submit = ({ inputText, loading, runsRemaining, userInputLength, maxUserInput, buttonText, location }) => {
  const user = useContext(UserContext);

  const inputLengthWarning = () => {
    const charactersOver = userInputLength - maxUserInput;
    const s = charactersOver > 1 ? 's' : '';
    const text = `Oops - that text is ${charactersOver} character${s} over the total limit.`
    return warningText(text);
  }

  const requestLimitWarning = () => {
    let text = "You've used up your current quota of spins. To get more, upgrade your subscription or contact us for help."
    if (noSpinsForForm()) {
      text = "This form isn't available on your current plan. Upgrade your subscription or contact us for help."
    }
    return warningText(text);
  }

  const profanityWarning = () => {
    const text = "Our filters think that text might be unsafe. Please let us know if this is a mistake."
    return warningText(text);
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

  const noSpinsForForm = () => {
    return location === 'listing_builder' && user.account_status === 'lapsed_trial';
  };

  if (runsRemaining < 1 || noSpinsForForm()) { return requestLimitWarning(); }
  if (invalidInputLength()) { return inputLengthWarning(); }
  if (isProfane()) { return profanityWarning(); }
  return submitButton();

}

Submit.propTypes = {
  inputText: PropTypes.string,
  loading: PropTypes.bool,
  runsRemaining: PropTypes.number,
  userInputLength: PropTypes.number,
  maxUserInput: PropTypes.number,
  buttonText: PropTypes.string,
  location: PropTypes.string,
}

export default Submit;
