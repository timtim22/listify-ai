import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supportedLanguages } from '../../helpers/utils';

const LanguageSelect = ({ setOutputLanguage }) => {
  return (
    <div className="flex justify-start items-center my-2 w-full">
      <label className="flex-shrink-0 w-1/3">Output language</label>
      <select
        onChange={(e) => setOutputLanguage(e.target.value)}
        className="form-select mx-3 mt-1">
        {supportedLanguages.map((item) => {
          return (
            <option key={item.value} value={item.value}>{item.name}</option>
          )
        })}
      </select>
    </div>
  )
}

export default LanguageSelect;
