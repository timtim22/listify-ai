import React from 'react';
import Filter from 'bad-words';

const profanityFilter = new Filter();
profanityFilter.removeWords('spac');

const ProfanityWrapper = ({ textToCheck, children }) => {

  const isProfane = (text) => {
    return profanityFilter.isProfane(text);
  }

  const profanityWarning = () => {
    const text = "Our filters think that text might be unsafe. Please let us know if this is a mistake."
    return warningText(text);
  }

  const warningText = (text) => {
    return (
      <div className="py-2 h-16 flex items-center">
        <p className="text-sm font-semibold text-center text-red-800">
          {text}
        </p>
      </div>
    )
  }

  if (isProfane(textToCheck)) {
    return profanityWarning();
  } else {
    return children;
  }
};

export default ProfanityWrapper;
