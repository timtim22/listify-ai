import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const SingleInput = ({ inputValue, onInputChange }) => {

  return (
    <label className="block mt-4 w-full">
      <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">
        Property details
      </span>
      <TextareaWithPlaceholder
        value={inputValue}
        onChange={onInputChange}
        placeholderContent={
        <>
          <p className="mt-px">- e.g. 3 bed apartment near Covent Garden</p>
          <p className="">- third floor with private balcony</p>
          <p className="">- close to West End theatres, bars and shops</p>
        </>
      } />
    </label>
  )
}

SingleInput.propTypes = {
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func
};


export default SingleInput;

