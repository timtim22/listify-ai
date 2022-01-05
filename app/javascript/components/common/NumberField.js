import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { coerceWithinRange } from '../../helpers/utils';

const NumberField = ({ value, onChange, title, minValue, maxValue }) => {
  return (
    <div className="flex justify-start items-center mb-2 w-full">
      <label className="w-1/3 text-sm text-gray-800">{title}</label>
      <div className="flex flex-col w-2/3 md:flex-row md:items-center">
        <div className="flex items-center">
          <input
            type="number"
            min={minValue}
            max={maxValue}
            placeholder="1"
            required={true}
            value={value}
            onChange={(e) => {onChange(coerceWithinRange(e.target.value, minValue, maxValue))}}
            className="w-16 text-sm form-inline-field"
          />
        </div>
      </div>
    </div>
  )
}

NumberField.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  title: PropTypes.string,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
};

export default NumberField;

