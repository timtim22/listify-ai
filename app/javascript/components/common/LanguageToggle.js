import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { supportedLanguages } from '../../helpers/utils';

const LanguageToggle = ({ translations, languageVisible, toggleVisible }) => {

  return (
    <select
      value={languageVisible}
      onChange={(e) => toggleVisible(e.target.value)}
      className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-xs mx-3">
      {supportedLanguages.map((item) => {
        return (
          <option key={item.name} value={item.value}>{item.value}</option>
        )
      })}
    </select>
  )
}

LanguageToggle.propTypes = {
  translations: PropTypes.array,
  toggleVisible: PropTypes.func,
  languageVisible: PropTypes.string,
};

export default LanguageToggle;

