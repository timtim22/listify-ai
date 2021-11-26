import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { supportedLanguages } from '../../helpers/translations';

const LanguageToggle = ({ languageVisible, toggleVisible }) => {

  return (
    <select
      value={languageVisible}
      onChange={(e) => toggleVisible(e.target.value)}
      className="block mx-3 w-full text-xs bg-gray-50 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      {supportedLanguages.map((item) => {
        return (
          <option key={item.name} value={item.value}>{item.value}</option>
        )
      })}
    </select>
  )
}

LanguageToggle.propTypes = {
  toggleVisible: PropTypes.func,
  languageVisible: PropTypes.string,
};

export default LanguageToggle;

