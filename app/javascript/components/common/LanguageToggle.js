import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LanguageToggle = ({ translations, showTranslation, toggleVisible }) => {

  const buttonText = () => {
    return showTranslation ? translations[0].to : "EN";
  }

  if (translations && translations.length > 0) {
    return (
      <button
        title="language"
        onClick={() => toggleVisible()}
        className="flex justify-center items-center py-0.5 mx-2 px-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 active:bg-gray-200"
      >
        <span className="text-xs font-medium tracking-wide">{buttonText()}</span>
      </button>
    )
  } else {
    return null;
  }
}

LanguageToggle.propTypes = {
  translations: PropTypes.array,
  toggleVisible: PropTypes.func,
  showTranslation: PropTypes.bool,
};

export default LanguageToggle;

