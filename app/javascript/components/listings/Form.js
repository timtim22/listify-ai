import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import { cleanObjectInputText } from '../../helpers/utils';
import { translateLabel, translatedSummaryString } from '../../helpers/translations';
import { newInputFields, exampleInputFields, idealStr, featureStr, trueUserInputLength } from '../../helpers/listingForm';
import Submit from '../inputs/Submit';
import ErrorNotice from '../common/ErrorNotice';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';
import LanguageSelect from '../common/LanguageSelect';
import ShortcutPanel from '../text/ShortcutPanel';

const maxInput = 250;
const newListing = { input_text: '' };

const Form = ({
  user,
  showExample,
  formType,
  loading,
  setLoading,
  runsRemaining,
  onResult
  }) => {

  const [listing, setListing] = useState({ ...newListing, request_type: formType });
  const [inputLanguage, setInputLanguage] = useState('EN');
  const [outputLanguage, setOutputLanguage] = useState('EN');
  const [errors, setErrors] = useState(null);
  const [userInputLength, setUserInputLength] = useState(0);
  const [exampleRequested, setExampleRequested] = useState(false);
  const [inputFields, setInputFields] = useState(newInputFields);
  const [shortcutField, setShortcutField] = useState({});

  useEffect(() => {
    if (listing.request_type !== formType) {
      setListingField('request_type', formType)
    }
  }, [formType])

  useEffect(() => {
    if (showExample || exampleRequested) {
      setInputFields(exampleInputFields);
    }
  }, [showExample, exampleRequested]);

  useEffect(() => {
    if (inputLanguage !== 'EN') {
      setInputFields({ ...newInputFields });
    }
  }, [inputLanguage]);

  useEffect(() => {
    const { property_type, bedrooms, location, ideal_for, key_features } = inputFields;
    const lead = translatedSummaryString(inputLanguage, bedrooms, property_type, location);
    const ideal = idealStr(ideal_for, inputLanguage);
    const features = featureStr(key_features);
    const inputText = lead + ideal + features;
    const trueLength = trueUserInputLength(inputFields);

    setInputText(inputText, trueLength);
  }, [inputFields]);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const setListingField = (field, value) => {
    setListing({ ...listing, [field]: value });
  }

  const setInputText = (value, trueUserInputLength) => {
    setUserInputLength(trueUserInputLength);
    setListingField('input_text', value);
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    onResult(response);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/listings.json",
      {
        listing: cleanObjectInputText({ ...listing, input_language: inputLanguage }),
        output_language: outputLanguage
      },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const showExampleButton = () => {
    if (user.account_status === "active_trial" &&
      listing.request_type === "listing_description") {
      return (
         <button
          type="button"
          onClick={() => setExampleRequested(true)}
          className="mt-8 text-xs text-purple-700 font-medium">
           Not sure? Tap to fill with an example
        </button>
      )
    }
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
    <>
     <form className="flex flex-col items-center w-full text-sm" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          <div className="flex flex-col justify-start w-full">
            <LanguageSelect onSelect={setInputLanguage} label={"Input language"} />
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
            <LanguageSelect onSelect={setOutputLanguage} label={"Output language"} />
          </div>

          <div className="flex flex-col items-center justify-center py-8 w-full">
            <Submit
              inputText={listing.input_text}
              userInputLength={userInputLength}
              maxUserInput={maxInput}
              loading={loading}
              runsRemaining={runsRemaining}
            />
            {showExampleButton()}
          </div>
          <ShortcutPanel setField={setField} targetField={shortcutField} />
        </div>
      </form>
    </>
  )
}

Form.propTypes = {
  user: PropTypes.object,
  showExample: PropTypes.string,
  formType: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  runsRemaining: PropTypes.number,
  onResult: PropTypes.func
};

export default Form;
