import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import NumberField from '../common/NumberField';
import Submit from '../inputs/Submit';

const newInputFields = {
  request_type: 'kf',
  type: '',
  features: '',
  bedrooms: 1,
  bathrooms: 1,
  receptions: 1,
  area: '',
  building: '',
  available: '',
  furnishing: 'furnished',
}

const maxInput = 800;

const Kf = ({ loading, setLoading, onResult, runsRemaining }) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [errors, setErrors] = useState(null);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    onResult(response);
  };

  const combinedInputFields = () => {
    const orderedFeatures = [
      'building', 'type', 'bedrooms', 'bathrooms', 'receptions', 'area', 'available', 'furnishing', 'features'
    ]
    return {
      request_type: inputFields.request_type,
      input_text: orderedFeatures.map(f => `${f}: ${inputFields[f]}`).join('\n')
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    createRequest(
      "/custom_inputs/generic_inputs.json",
      { generic_input: combinedInputFields() },
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

  const numberField = (title, field) => {
    return (
      <NumberField
        title={title}
        value={inputFields[field]}
        onChange={(v) => setField(field, v)}
        minValue={1}
        maxValue={50}
      />
    )
  }

  const selectField = (title, field, options) => {
    return (
      <div className="flex justify-start items-center my-2 w-full">
        <label className="flex-shrink-0 w-1/3">{title}</label>
        <select
          value={inputFields[field]}
          onChange={(e) => {setField(field, e.target.value)}}
          className="mx-3 mt-1 text-sm form-select">
            {options.map((item) => {
              return (
                <option key={item} value={item}>{item}</option>
              )
            })}
        </select>
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
            {textRow('Property Type', 'type')}
            <div className="mb-4"></div>
            {numberField('Bedrooms', 'bedrooms', 0, 10)}
            {numberField('Bathrooms', 'bathrooms', 0, 10)}
            {numberField('Reception rooms', 'receptions', 0, 10)}
            {textRow('Area (sq ft)', 'area')}
            {textRow('Building/Development Name', 'building')}
            {textRow('Available from', 'available')}
            {selectField('Furnished', 'furnishing', ['furnished', 'unfurnished'])}
            {textArea('Features', 'features')}

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

Kf.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
  runsRemaining: PropTypes.number
}

export default Kf;

