import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supportedLanguages } from '../../helpers/translations';

const LanguageSelect = ({ onSelect, label }) => {
  return (
    <div className="flex justify-start items-center my-2 w-full">
      <label className="flex-shrink-0 w-1/3">{label}</label>
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="mx-3 mt-1 form-select">
        {supportedLanguages.map((item) => {
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
  label: PropTypes.string
};

export default LanguageSelect;
