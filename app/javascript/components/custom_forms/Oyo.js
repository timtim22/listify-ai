import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';

const newInputFields = {
  request_type: 'oyo_one',
  property_type: '',
  target_user: '',
  location: '',
  location_detail: '',
  usp_one: '',
  usp_two: '',
  usp_three: ''
}

const maxInput = 800;

const Oyo = ({ loading, setLoading, onResult, runsRemaining }) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [errors, setErrors] = useState(null);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    onResult(response);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    createRequest(
      "/custom_inputs/oyo_one.json",
      { oyo_one: inputFields, live_request: false },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const joinedInputs = () => {
    const inputs = { ...inputFields };
    return Object.values(inputs).join(" ");
  };

  const trueUserInputLength = () => {
    return joinedInputs().length;
  }

  const textRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mt-2 w-full">
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

  return (
    <div className="flex flex-col items-center w-full text-sm">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="self-center w-4/5 text-sm">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {textRow('Property Type', 'property_type', 'e.g. apartment', true)}
          {textRow('Target user', 'target_user', 'e.g. couples' )}
          {textRow('Location', 'location', 'e.g. London')}
          {textRow('Location detail', 'location_detail', 'e.g. in the heart of the city')}
          {textRow('USP', 'usp_one')}
          {textRow('USP', 'usp_two')}
          {textRow('USP', 'usp_three')}
          <div className="flex flex-col items-center justify-center py-8 w-full">
            <Submit
              inputText={joinedInputs()}
              userInputLength={trueUserInputLength()}
              maxUserInput={maxInput}
              loading={loading}
              runsRemaining={runsRemaining}
            />
          </div>
        </div>
      </form>
    </div>
  )
};

Oyo.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
  runsRemaining: PropTypes.number
}

export default Oyo;
