import React from 'react';
import PropTypes from 'prop-types';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const maxDetailLength = 150;
const charSoftWarningLength = 30;
const charHardWarningLength = 10;

const BedroomInput = ({ bedroom, title, updateIndex, placeholderContent }) => {
  const updateIfLengthAllowed = (value, charLimit) => {
    value.length <= charLimit && updateIndex({ ...bedroom, details: value });
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

  const buttonFor = (bedName) => {
    if (bedroom.bed === bedName.toLowerCase()) {
      console.log(title, bedName)
    }

    return (
      <div className={`${bedName.includes("Other") ? '' : 'w-24'} flex items-center`}>
        <input
          type="radio"
          name={`${title}-${bedName}`}
          checked={bedroom.bed === bedName.toLowerCase()}
          className="m-2 focus:shadow-none focus:ring-0"
          onChange={() => updateIndex({ ...bedroom, bed: bedName.toLowerCase()})}
        />
        <label>
          {bedName}
        </label>
      </div>
    )
  }

  const charsLeft = maxDetailLength - (bedroom.details && bedroom.details.length || 0);

  return (
    <div key={bedroom.id} className="flex flex-col w-full mt-4">
      <div className="mb-4 w-full h-px bg-gray-200"></div>
      <div className={`${charsLeft <= charSoftWarningLength ? "" : "mb-2"} flex justify-start items-start w-full`}>
        <label className="flex-shrink-0 mt-3 w-1/3 text-sm text-gray-800">{title}</label>
        <div className="px-3 w-full flex flex-col">
          <div className="flex flex-wrap items-center text-xs mb-4">
            {buttonFor('Single')}
            {buttonFor('Double')}
            {buttonFor('Queen')}
            {buttonFor('King')}
            {buttonFor('Super King')}
            {buttonFor('Twin')}
            {buttonFor('Other (give details)')}
          </div>
          <label className="text-xs font-semibold">More details</label>

          <TextareaWithPlaceholder
            value={bedroom.details || ""}
            onChange={(value) => updateIfLengthAllowed(value, maxDetailLength)}
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
  bedroom: PropTypes.object,
  title: PropTypes.string,
  updateIndex: PropTypes.func,
  placeholderContent: PropTypes.object,
};

export default BedroomInput;

