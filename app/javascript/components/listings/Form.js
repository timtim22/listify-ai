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
import SingleInput from './SingleInput';
import SplitInput from './SplitInput';
import DisabledPillButton from './DisabledPillButton';

const maxInput = 250;
const newListing = { input_text: '' };

const Form = ({ showExample, formType, loading, setLoading, runsRemaining, onResult }) => {
  const [listing, setListing] = useState({ ...newListing, request_type: formType });
  const [outputLanguage, setOutputLanguage] = useState('EN');
  const [errors, setErrors] = useState(null);
  const [userInputLength, setUserInputLength] = useState(0);
  const [inputMode, setInputMode] = useState('form');
  const [exampleSeen, setExampleSeen] = useState(false);

  const onError = useScrollToTopOnError(errors);

  useEffect(() => {
    if (listing.request_type !== formType) {
      setField('request_type', formType)
    }
  }, [formType])

  const changeInputMode = () => {
    const newMode = inputMode === 'form' ? 'text' : 'form';
    setField('input_text', '');
    setUserInputLength(0);
    setOutputLanguage('EN');
    setErrors(null);
    setExampleSeen(true);
    setInputMode(newMode);
  }

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
      { listing: cleanObjectInputText(listing), output_language: outputLanguage },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }


  const formInput = () => {
    if (inputMode === 'form') {
      return (
        <SplitInput
          showExample={showExample && !exampleSeen}
          inputValue={listing.input_text}
          onInputChange={setInputText}
        />
      )
    } else {
      return (
        <SingleInput
          inputValue={listing.input_text}
          onInputChange={setInputText}
        />
      )
    }
  }

  const inputModeSwitch = () => {
    return (
      <Switch
        handleToggle={changeInputMode}
        isOn={inputMode === 'text'}
        leftLabel='form'
        rightLabel='text'
      />
    )
  }

  return (
    <>
      <div className="flex flex-col items-center w-full">
        {inputModeSwitch()}
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      </div>
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {formInput()}
          {inputMode === "form" &&
            <LanguageSelect setOutputLanguage={setOutputLanguage} />}
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
