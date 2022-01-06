import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import { createRequest } from '../../helpers/requests';
import { cleanObjectInputText } from '../../helpers/utils';
import ErrorNotice from '../common/ErrorNotice';
import LanguageSelect from '../common/LanguageSelect';
import Switch from '../common/Switch';
import Submit from '../inputs/Submit';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import SplitInput from './SplitInput';
import DisabledPillButton from './DisabledPillButton';

const maxInput = 250;
const newListing = { input_text: '' };

const Form = ({ showExample, formType, loading, setLoading, runsRemaining, onResult }) => {
  const [listing, setListing] = useState({ ...newListing, request_type: formType });
  const [inputLanguage, setInputLanguage] = useState('EN');
  const [outputLanguage, setOutputLanguage] = useState('EN');
  const [errors, setErrors] = useState(null);
  const [userInputLength, setUserInputLength] = useState(0);
  const [exampleSeen, setExampleSeen] = useState(false);

  const onError = useScrollToTopOnError(errors);

  useEffect(() => {
    if (listing.request_type !== formType) {
      setField('request_type', formType)
    }
  }, [formType])

  const setField = (field, value) => {
    setListing({ ...listing, [field]: value });
  }

  const setInputText = (value, trueUserInputLength) => {
    setUserInputLength(trueUserInputLength);
    setField('input_text', value);
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


  const formInput = () => {
    return (
      <SplitInput
        showExample={showExample && !exampleSeen}
        inputValue={listing.input_text}
        onInputChange={setInputText}
        inputLanguage={inputLanguage}
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
          <LanguageSelect onSelect={setInputLanguage} label={"Input language"} />
          {formInput()}
          <LanguageSelect onSelect={setOutputLanguage} label={"Output language"} />
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={listing.input_text}
              userInputLength={userInputLength}
              maxUserInput={maxInput}
              loading={loading}
              runsRemaining={runsRemaining}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default Form;
