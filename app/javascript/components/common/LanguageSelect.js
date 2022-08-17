import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../listings/New';
import { inputLanguages, outputLanguagesForUser } from '../../helpers/translations';

const LanguageSelect = ({ onSelect, label, isInput }) => {
  const user = useContext(UserContext);

  const languageSet = isInput ? inputLanguages() : outputLanguagesForUser(user);

  return (
    <div className="flex justify-start items-center my-2 w-full">
      <label className="flex-shrink-0 w-1/3">{label}</label>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="mx-3 mt-1 text-sm form-select">
        {languageSet.map((item) => {
          return (
            <option key={item.value} value={item.value}>{item.name}</option>
          )
        })}
      </select>
    </div>
  )
}

LanguageSelect.propTypes = {
  onSelect: PropTypes.func,
  label: PropTypes.string,
  isInput: PropTypes.bool
};

export default LanguageSelect;
