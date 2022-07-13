import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translateLabel, translationFor, translatedSummaryString } from '../../helpers/translations';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';
import ShortcutPanel from '../text/ShortcutPanel';

const newInputFields = {
  property_type: '',
  bedrooms: 1,
  location: '',
  ideal_for: '',
  key_features: ''
}

const exampleInputFields = {
  property_type: 'apartment',
  bedrooms: 3,
  location: 'Malaga',
  ideal_for: 'families',
  key_features: '- sea views\n- large balcony\n- heated swimming pool\n- open plan living space\n- 5 minutes walk to shops and restaurants\n- short drive to the airport',
}

const trueUserInputLength = (inputFields) => {
  return Object.values(inputFields).join("").length;
}

const SplitInput = ({ onInputChange, showExample, inputLanguage }) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [shortcutField, setShortcutField] = useState({});

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
    const { property_type, bedrooms, location, ideal_for, key_features } = inputFields;
    const lead = translatedSummaryString(inputLanguage, bedrooms, property_type, location);
    const ideal = idealStr(ideal_for);
    const features = featureStr(key_features);
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
          onFocus={() => setShortcutField({ name: key })}
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
        {textRow(translateLabel('Property type', inputLanguage), 'property_type', 'e.g. apartment, house...', true)}
        {bedroomsCountRow()}
        {textRow(translateLabel('Location', inputLanguage), 'location', '')}
        {textRow(translateLabel('Ideal for', inputLanguage), 'ideal_for', 'e.g. families, couples')}
        <div className="flex items-start w-full">
          <label className="flex-shrink-0 mt-2 w-1/3">{translateLabel('Key features', inputLanguage)}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              textAreaId={'key_features'}
              value={inputFields.key_features}
              onChange={(value) => setField('key_features', value)}
              onFocus={() => setShortcutField({ name: 'key_features' })}
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
      <ShortcutPanel setField={setField} targetField={shortcutField} />
    </div>
  )
}

SplitInput.propTypes = {
  onInputChange: PropTypes.func,
  inputLanguage: PropTypes.string,
  showExample: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export default SplitInput;
