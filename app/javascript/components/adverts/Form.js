import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import { cleanObjectInputText } from '../../helpers/utils';
import ErrorNotice from '../common/ErrorNotice';
import LanguageSelect from '../common/LanguageSelect';
import Submit from '../inputs/Submit';
import SplitInput from '../listings/SplitInput';

const maxInput = 250;
const newAdvert = { input_text: '', request_type: 'facebook_advert' };
const adTypes = [
  { name: 'Facebook', value: 'facebook_advert' },
  { name: 'Google', value: 'google_advert' }
]

const Form = ({
  user,
  showExample,
  loading,
  setLoading,
  runsRemaining,
  onResult
}) => {

  const [advert, setAdvert] = useState(newAdvert);
  const [inputLanguage, setInputLanguage] = useState('EN');
  const [outputLanguage, setOutputLanguage] = useState('EN');
  const [errors, setErrors] = useState(null);
  const [userInputLength, setUserInputLength] = useState(0);
  const [exampleRequested, setExampleRequested] = useState(false);

  const setField = (field, value) => {
    setAdvert({ ...advert, [field]: value });
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
      "/adverts.json",
      {
        advert: cleanObjectInputText({ ...advert, input_language: inputLanguage }),
        output_language: outputLanguage
      },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const changeInputType = () => {
    const newType = advert.request_type === 'facebook_advert' ? 'google_advert' : 'facebook_advert';
    setErrors(null);
    setField('request_type', newType);
  }

  const adTypeSwitch = () => {
    return (
      <div className="flex items-center my-2 max-w-2xl">
        <label className="flex-shrink-0 w-1/3 text-sm">Advert type</label>
        <select
          onChange={() => changeInputType()}
          className="mx-3 mt-1 text-sm form-select">
          {adTypes.map((item) => {
            return (
              <option key={item.value} value={item.value}>{item.name}</option>
            )
          })}
        </select>
      </div>
    )
  }

  const formInput = () => {
    return (
      <SplitInput
        showExample={showExample || exampleRequested}
        inputValue={advert.input_text}
        onInputChange={setInputText}
        inputLanguage={inputLanguage}
      />
    )
  }

  const showExampleButton = () => {
    if (user.account_status === "active_trial") {
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
          {adTypeSwitch()}
          {formInput()}
          <LanguageSelect onSelect={setOutputLanguage} label={"Output language"} />
          <div className="flex flex-col items-center justify-center py-8 w-full">
            <Submit
              inputText={advert.input_text}
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
  showExample: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  runsRemaining: PropTypes.number,
  onResult: PropTypes.func
};

export default Form;
