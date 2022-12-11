import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';

const newInputFields = {
  request_type: 'oyo_two',
  usp_one: '',
  usp_two: '',
  usp_three: '',
  usp_four: '',
  usp_five: '',
}

const maxInput = 800;

const OyoTwo = ({ loading, setLoading, onResult, runsRemaining }) => {
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
      "/custom_inputs/oyo.json",
      { oyo: inputFields },
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
        <div className="self-center w-full text-sm">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-full max-w-2xl">
          <h1 className="font-bold text-lg text-gray-400">1. Why stay here?</h1>
          <div className="my-4 w-full h-px bg-gray-200"></div>
          <h1 className="font-bold text-lg">2. Things to do around</h1>
          <div className="my-4 w-full h-px bg-gray-200"></div>
          {textRow('USP 1', 'usp_one', 'e.g. places of interest')}
          {textRow('USP 2', 'usp_two', 'e.g. nearby attractions')}
          {textRow('USP 3', 'usp_three')}
          {textRow('USP 4', 'usp_four')}
          {textRow('USP 5', 'usp_five')}
          <div className="flex flex-col items-center justify-center py-8 w-full">
            <Submit
              checkUserAccount={false}
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

OyoTwo.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
  runsRemaining: PropTypes.number
}

export default OyoTwo;

