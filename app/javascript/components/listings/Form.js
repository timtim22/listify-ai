import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import { createRequest } from '../../helpers/requests';
import { cleanObjectInputText } from '../../helpers/utils';
import ErrorNotice from '../common/ErrorNotice';
import LanguageSelect from '../common/LanguageSelect';
import Submit from '../inputs/Submit';
import SplitInput from './SplitInput';

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
        showExample={showExample || exampleRequested}
        inputValue={listing.input_text}
        onInputChange={setInputText}
        inputLanguage={inputLanguage}
      />
    )
  }

  const showExampleButton = () => {
    if (user.subscription_status === "on_trial" &&
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
        </div>
      </form>
    </>
  )
}

Form.propTypes = {
  user: PropTypes.object,
  showExample: PropTypes.bool,
  formType: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  runsRemaining: PropTypes.number,
  onResult: PropTypes.func
};

export default Form;
