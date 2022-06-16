import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';

const newInputFields = {
  request_type: 'sykes_middle',
  key_features: ''
}

const maxInput = 800;

const Sykes = ({ loading, setLoading, onResult, runsRemaining }) => {
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
      "/custom_inputs/sykes.json",
      { sykes_middle: inputFields },
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

  const textArea = (title, field) => {
    return (
      <div key={field} className="flex items-start w-full">
        <label className="flex-shrink-0 mt-2 w-1/3">{title}</label>
        <textarea
          type="text"
          value={inputFields[field] || ''}
          onChange={(e) => {setField(field, e.target.value)}}
          required={true}
          className="h-32 text-sm form-text-area mx-3"></textarea>
      </div>
    )
  };



  return (
    <div>
      <div className="flex flex-col items-center w-full text-sm">
        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
          <div className="self-center w-full text-sm">
            <ErrorNotice errors={errors} />
          </div>
          <div className="flex flex-col w-full max-w-2xl">
            {textArea('Key Features', 'key_features')}
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
    </div>
  )
};

Sykes.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
  runsRemaining: PropTypes.number
}

export default Sykes;
