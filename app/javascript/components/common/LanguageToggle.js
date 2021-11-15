import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LanguageToggle = ({ translations, languageVisible, toggleVisible }) => {

  const buttonText = () => {
    return languageVisible === "EN" ? "EN" : translations[0].to;
  }

  if (translations && translations.length > 0) {
    const fetchedLanguages = translations.map(t => t.to);
    fetchedLanguages.push("EN");
    return (
      <select
        onChange={(e) => toggleVisible(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-xs mx-3">
        {fetchedLanguages.map((item) => {
          return (
            <option key={item} value={item}>{item}</option>
          )
        })}
      </select>
    )
  } else {
    return null;
  }
}

LanguageToggle.propTypes = {
  translations: PropTypes.array,
  toggleVisible: PropTypes.func,
  languageVisible: PropTypes.string,
};

export default LanguageToggle;

