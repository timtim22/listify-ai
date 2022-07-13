import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translateLabel, translationFor, translatedSummaryString } from '../../helpers/translations';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';
import TextSnippetControl from '../common/TextSnippetControl';

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
  keyFeatures: '- sea views\n- large balcony\n- heated swimming pool\n- open plan living space\n- 5 minutes walk to shops and restaurants\n- short drive to the airport',
}

const trueUserInputLength = (inputFields) => {
  return Object.values(inputFields).join("").length;
}

const SplitInput = ({ onInputChange, showExample, inputLanguage }) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [snippetField, setSnippetField] = useState(null);

  useEffect(() => {
    if (showExample) {
      setInputFields(exampleInputFields);
    }
  }, [showExample]);

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
          id={key}
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => {setField(key, e.target.value)}}
          onFocus={() => setSnippetField(key)}
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const bedroomsCountRow = () => {
    return (
      <NumberField
        title={translateLabel('Bedrooms', inputLanguage)}
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
        {textRow(translateLabel('Property type', inputLanguage), 'propertyType', 'e.g. apartment, house...', true)}
        {bedroomsCountRow()}
        {textRow(translateLabel('Location', inputLanguage), 'location', '')}
        {textRow(translateLabel('Ideal for', inputLanguage), 'idealFor', 'e.g. families, couples')}
        <div className="flex items-start w-full">
          <label className="flex-shrink-0 mt-2 w-1/3">{translateLabel('Key features', inputLanguage)}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              textAreaId={'keyFeatures'}
              value={inputFields.keyFeatures}
              onChange={(value) => setField('keyFeatures', value)}
              onFocus={() => setSnippetField('keyFeatures')}
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
      <TextSnippetControl setField={setField} currentField={snippetField} />
    </div>
  )
}

SplitInput.propTypes = {
  onInputChange: PropTypes.func,
  inputLanguage: PropTypes.string,
  showExample: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export default SplitInput;
