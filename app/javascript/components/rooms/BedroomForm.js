import React, { useState, useEffect } from 'react';
import { coerceWithinRange } from '../../helpers/utils';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const maxDetailLength = 150;
const charSoftWarningLength = 30;
const charHardWarningLength = 10;

const BedroomForm = ({ roomDescription, setRoomDescription }) => {
  const [bedroomCount, setBedroomCount] = useState(1);

  const updateBedroomInState = (index, newValue) => {
    const { bedrooms } = roomDescription;
    let newBedrooms = [ ...bedrooms ];
    newBedrooms[index] = newValue;
    setRoomDescription({ ...roomDescription, bedrooms: newBedrooms });
  }

  const updateIfLengthAllowed = (index, value, charLimit) => {
    value.length <= charLimit && updateBedroomInState(index, value);
  }

  const changeBedroomCount = (newCount) => {
    if (newCount < roomDescription.bedrooms.length) {
      setRoomDescription({
        ...roomDescription,
        bedrooms: roomDescription.bedrooms.slice(0, newCount)
      });
      setBedroomCount(newCount);
    } else {
      setRoomDescription({
        ...roomDescription,
        bedrooms: [ ...roomDescription.bedrooms, '' ]
      });
      setBedroomCount(newCount);
    }
  }

  const bedroomCountRow = () => {
    return (
      <div className="flex justify-start items-center mb-4 w-full">
        <label className="w-1/3 font-medium text-sm text-gray-700">Bedrooms to describe</label>
        <div className="flex flex-col w-2/3 md:flex-row md:items-center">
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              max="4"
              placeholder="1"
              required={true}
              value={bedroomCount}
              onChange={(e) => {changeBedroomCount(coerceWithinRange(e.target.value, 1, 4))}}
              className="w-16 text-sm form-inline-field"
            />
          </div>
        </div>
      </div>
    )
  }

  const detailPlaceholder = (placeholderText) => {
    return (
      <div className="text-sm flex flex-col items-start mb-px leading-relaxed">
        <p>{placeholderText}</p>
      </div>
    )
  }

  const bedroomRow = (title, index, placeholderText) => {
    const bedroom = roomDescription.bedrooms[index];
    const charsLeft = maxDetailLength - (bedroom && bedroom.length || 0);
    return (
      <div key={index} className="flex flex-col w-full">
        <div className={`${charsLeft <= charSoftWarningLength ? "" : "mb-4"} flex justify-start items-start w-full`}>
          <label className="flex-shrink-0 mt-3 w-1/3 text-sm font-medium text-gray-700">{title}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              value={bedroom || ""}
              onChange={(value) => updateIfLengthAllowed(index, value, maxDetailLength)}
              heightClass={"h-16"}
              placeholderContent={detailPlaceholder(placeholderText)}
              customClasses={"text-sm"}
            />
          </div>
        </div>
        <div className="self-end pt-1 pr-3 text-xs font-medium text-gray-500">
          {characterCounter(charsLeft)}
        </div>
      </div>
    )
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

  const bedroomCountAsArray = () => {
    const number = bedroomCount === "" ? 1 : parseInt(bedroomCount);
    return Array.from(Array(number).keys());
  }

  const bedroomFields = () => {
    return (
      <div className="flex flex-col mb-4">
        {bedroomCountAsArray().map((i) => {
          return (
            bedroomRow(`Bedroom ${i + 1}`, i, 'e.g. double bed, ensuite...')
          )
        })}
      </div>
    )
  }

  return (
    <>
      {bedroomCountRow()}
      {bedroomFields()}
    </>
  )
}

export default BedroomForm;
