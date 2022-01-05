import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translationFor, translatedSummaryString } from '../../helpers/translations';
import { capitaliseFirstLetter } from '../../helpers/utils';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';

const newInputFields = {
  propertyType: '',
  bedrooms: 1,
  location: '',
  idealFor: '',
  keyFeatures: ''
}

const exampleInputFields = {
  propertyType: 'apartment',
  bedrooms: 3,
  location: 'Malaga',
  idealFor: 'families',
  keyFeatures: '- sea views\n- large balcony\n- heated swimming pool\n- 5 minutes walk to shops and restaurants',
}

const coerceWithinRange = (inputNumber, min, max) => {
  const number = parseInt(inputNumber);
  if (number < min) { return min; }
  if (number > max) { return max; }
  return number;
}

const trueUserInputLength = (inputFields) => {
  return Object.values(inputFields).join("").length;
}

const SplitInput = ({ inputValue, onInputChange, showExample, inputLanguage }) => {
  const [inputFields, setInputFields] = useState(showExample ? exampleInputFields : newInputFields);

  useEffect(() => {
    if (inputLanguage !== 'EN') {
      setInputFields({ ...newInputFields });
    }
  }, [inputLanguage]);

  useEffect(() => {
    const { propertyType, bedrooms, location, idealFor, keyFeatures } = inputFields;
    const lead = translatedSummaryString(inputLanguage, bedrooms, propertyType, location);
    const ideal = idealStr(idealFor);
    const features = featureStr(keyFeatures);
    const inputText = lead + ideal + features;
    const trueLength = trueUserInputLength(inputFields);

    onInputChange(inputText, trueLength);
  }, [inputFields]);

  const translateLabel = (string) => {
    const translation = translationFor(inputLanguage, string.toLowerCase());
    return capitaliseFirstLetter(translation);
  }

  const idealStr = (idealFor) => {
    if (idealFor && idealFor.length > 0) {
      return `\n- ${translationFor(inputLanguage, 'ideal for')} ${idealFor}`;
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
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const bedroomsCountRow = () => {
    return (
      <NumberField
        title={translateLabel('Bedrooms')}
        value={inputFields.bedrooms}
        onChange={(v) => setField('bedrooms', v)}
        minValue={1}
        maxValue={50}
      />
    )
  }

  return (
    <div className="flex flex-col justify-start w-full">
      <div className="flex flex-col justify-start">
        {textRow(translateLabel('Property type'), 'propertyType', 'e.g. apartment, house...', true)}
        {bedroomsCountRow()}
        {textRow(translateLabel('Location'), 'location', '')}
        {textRow(translateLabel('Ideal for'), 'idealFor', 'e.g. families, couples')}
        <div className="flex items-start w-full">
          <label className="flex-shrink-0 mt-2 w-1/3">{translateLabel('Key features')}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              value={inputFields.keyFeatures}
              onChange={(value) => setField('keyFeatures', value)}
              customClasses={"text-sm"}
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
  onInputChange: PropTypes.func,
  inputLanguage: PropTypes.string,
  showExample: PropTypes.bool,
};

export default SplitInput;
