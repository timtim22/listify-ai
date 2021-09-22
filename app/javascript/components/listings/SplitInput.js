import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const newInputFields = {
  propertyType: '',
  bedrooms: '',
  location: '',
  idealFor: '',
  keyFeatures: ''
}

const exampleInputFields = {
  propertyType: 'beach penthouse',
  bedrooms: '1',
  location: 'Malaga',
  idealFor: 'romantic getaway',
  keyFeatures: '- sea views\n- large balcony\n- 5 minutes walk to shops and restaurants',
}

const coerceWithinRange = (inputNumber, min, max) => {
  const number = parseInt(inputNumber);
  if (number < min) { return min; }
  if (number > max) { return max; }
  return number;
}

const SplitInput = ({ inputValue, onInputChange, showExample }) => {
  const [inputFields, setInputFields] = useState(showExample ? exampleInputFields : newInputFields);

  useEffect(() => {
    const { propertyType, bedrooms, location, idealFor, keyFeatures } = inputFields;
    const lead = bedroomStr(bedrooms) + propertyStr(propertyType) + locationStr(location);
    const ideal = idealStr(idealFor);
    const features = featureStr(keyFeatures);

    onInputChange(lead + ideal + features);
  }, [inputFields]);


  const bedroomStr = (bedrooms) => {
    if (bedrooms) {
    return `- ${bedrooms} bedroom`;
    } else {
      return '';
    }
  }

  const propertyStr = (propertyType) => {
    if (propertyType && propertyType.length > 0) {
      return ` ${propertyType}`;
    } else {
      return '';
    }
  }

  const locationStr = (location) => {
    if (location && location.length > 0) {
      return ` in ${location}`;
    } else {
      return '';
    }
  }

  const idealStr = (idealFor) => {
    if (idealFor && idealFor.length > 0) {
      return `\n- ideal for ${idealFor}`;
    } else {
      return '';
    }
  }

  const featureStr = (keyFeatures) => {
    if (keyFeatures && keyFeatures.length > 0) {
      const lines = keyFeatures.split("\n");
      const str = lines.map(l => l.startsWith("-") ? l : `- ${l}`).join("\n");
      return `\n${str}`;
    } else {
      return '';
    }
  }

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const textRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => {setField(key, e.target.value)}}
          className="w-full form-inline-field"
        />
      </div>
    )
  }

  const bedroomRow = () => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="w-1/3">Bedrooms</label>
        <input
          type="number"
          min="1"
          max="50"
          placeholder="2"
          required={true}
          value={inputFields.bedrooms}
          onChange={(e) => {setField('bedrooms', coerceWithinRange(e.target.value, 1, 50))}}
          className="w-16 form-inline-field"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex flex-col justify-start">
        {textRow('Property Type', 'propertyType', 'e.g. apartment, house...', true)}
        {bedroomRow()}
        {textRow('Location', 'location', '')}
        {textRow('Ideal for', 'idealFor', 'e.g. families, couples')}
        <div className="flex items-start w-full">
          <label className="flex-shrink-0 w-1/3">Key features</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              value={inputFields.keyFeatures}
              onChange={(value) => setField('keyFeatures', value)}
              placeholderContent={
              <>
                <p className="mt-px">- e.g. large private balcony</p>
                <p className="">- five minutes walk to beach</p>
                <p className="">- free parking</p>
              </>
            } />
          </div>
        </div>
      </div>
    </div>
  )
}

SplitInput.propTypes = {
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func
};


export default SplitInput;

