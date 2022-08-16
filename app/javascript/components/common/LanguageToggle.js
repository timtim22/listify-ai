import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../listings/New';
import { outputLanguagesForUser } from '../../helpers/translations';

const LanguageToggle = ({ languageVisible, toggleVisible }) => {
  const user = useContext(UserContext);

  return (
    <select
      value={languageVisible}
      onChange={(e) => toggleVisible(e.target.value)}
      className="block mx-3 w-full text-xs bg-gray-50 rounded-md border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
      {outputLanguagesForUser(user).map((item) => {
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

