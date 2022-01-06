import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const maxDetailLength = 150;
const charSoftWarningLength = 30;
const charHardWarningLength = 10;

const BedroomInput = ({ bedrooms, title, index, updateIndex, placeholderContent }) => {
  const updateIfLengthAllowed = (index, value, charLimit) => {
    value.length <= charLimit && updateIndex(index, value);
  }

  const characterCounter = (charsLeft) => {
    if (charsLeft <= charSoftWarningLength) {
      return (
        <p className={charsLeft <= charHardWarningLength ? "text-red-500" : ""}>
          {charsLeft}
        </p>
      )
    }
  }

  const bedroom = bedrooms[index];
  const charsLeft = maxDetailLength - (bedroom && bedroom.length || 0);

  return (
    <div key={index} className="flex flex-col w-full">
      <div className={`${charsLeft <= charSoftWarningLength ? "" : "mb-2"} flex justify-start items-start w-full`}>
        <label className="flex-shrink-0 mt-3 w-1/3 text-sm text-gray-800">{title}</label>
        <div className="px-3 w-full">
          <TextareaWithPlaceholder
            value={bedroom || ""}
            onChange={(value) => updateIfLengthAllowed(index, value, maxDetailLength)}
            heightClass={"h-16"}
            placeholderContent={placeholderContent}
            customClasses={"text-sm"}
          />
        </div>
      </div>
      <div className="self-end pt-1 pr-3 text-xs text-gray-500">
        {characterCounter(charsLeft)}
      </div>
    </div>
  )
}

BedroomInput.propTypes = {
  bedrooms: PropTypes.array,
  title: PropTypes.string,
  index: PropTypes.number,
  updateIndex: PropTypes.func,
  placeholderContent: PropTypes.object,
};

export default BedroomInput;

