import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import NumberField from '../common/NumberField';
import { coerceWithinRange } from '../../helpers/utils';
import Submit from '../inputs/Submit';

const newInputFields = {
  request_type: 'kf',
  type: '',
  features: '',
  key_highlights: '',
  double_bedrooms: 1,
  single_bedrooms: 0,
  bathrooms: 1,
  ensuites: 0,
  receptions: 1,
  cloakrooms: 0,
  area: 1000,
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
      'building', 'type', 'bedrooms', 'double_bedrooms', 'single_bedrooms', 'bathrooms', 'ensuites', 'receptions', 'cloakrooms', 'area', 'available', 'furnishing', 'features', 'key_highlights'
    ]
    const presentFields = orderedFeatures.filter(f => inputFields[f] !== 0 && inputFields[f] !== '')
    const combinedFields = presentFields.map((f) => {
      if (f === 'bedrooms') {
        return `bedrooms: ${inputFields.double_bedrooms + inputFields.single_bedrooms}`
      } else {
        return `${f}: ${inputFields[f]}`
      }
    })

    return {
      request_type: inputFields.request_type,
      input_text: combinedFields.join('\n')
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
      <div key={field} className="flex items-start w-full mb-2">
        <label className="flex-shrink-0 mt-2 w-1/3">{title}</label>
        <textarea
          type="text"
          value={inputFields[field] || ''}
          onChange={(e) => {setField(field, e.target.value)}}
          required={true}
          className="h-20 text-sm form-text-area mx-3"></textarea>
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

  const bedroomRow = () => {
    return (
      <div className="w-full flex items-center mb-2">
        <label className="w-1/3 text-sm text-gray-800">Rooms</label>
        <div className="w-2/3 flex justify-start items-center">
          <div className="w-1/2 flex items-center">
            {numberInput(0, 10, inputFields['double_bedrooms'], (v) => setField('double_bedrooms', v))}
            <label className="text-sm text-gray-800">Doubles</label>
          </div>
          <div className="w-1/2 flex items-center">
            {numberInput(0, 10, inputFields['single_bedrooms'], (v) => setField('single_bedrooms', v))}
            <label className="text-sm text-gray-800">Singles</label>
          </div>
        </div>
      </div>
    )
  };

  const bathroomRow = () => {
    return (
      <div className="w-full flex items-center mb-2">
        <label className="w-1/3 text-sm text-gray-800"></label>
        <div className="w-2/3 flex justify-start items-center">
          <div className="w-1/2 flex items-center">
            {numberInput(0, 10, inputFields['bathrooms'], (v) => setField('bathrooms', v))}
            <label className="text-sm text-gray-800">Bathrooms</label>
          </div>
          <div className="w-1/2 flex items-center">
            {numberInput(0, 10, inputFields['ensuites'], (v) => setField('ensuites', v))}
            <label className="text-sm text-gray-800">Ensuites</label>
          </div>
        </div>
      </div>
    )
  };

  const receptionRow = () => {
    return (
      <div className="w-full flex items-center mb-2">
        <label className="w-1/3 text-sm text-gray-800"></label>
        <div className="w-2/3 flex justify-start items-center">
          <div className="w-1/2 flex items-center">
            {numberInput(0, 10, inputFields['receptions'], (v) => setField('receptions', v))}
            <label className="text-sm text-gray-800">Reception rooms</label>
          </div>
          <div className="w-1/2 flex items-center">
            {numberInput(0, 10, inputFields['cloakrooms'], (v) => setField('cloakrooms', v))}
            <label className="text-sm text-gray-800">Cloakrooms</label>
          </div>
        </div>
      </div>
    )
  };

  const numberInput = (minValue, maxValue, value, onChange) => {
    return (
      <div className="flex items-center">
        <input
          type="number"
          min={minValue}
          max={maxValue}
          placeholder="1"
          required={true}
          value={value}
          onChange={(e) => {onChange(coerceWithinRange(e.target.value, minValue, maxValue))}}
          className="w-16 text-sm form-inline-field"
        />
      </div>
    )
  };

  combinedInputFields()

  return (
    <div>
      <div className="flex flex-col items-center w-full text-sm mt-4">
        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
          <div className="self-center w-full text-sm">
            <ErrorNotice errors={errors} />
          </div>
          <div className="flex flex-col w-full max-w-2xl">
            {textRow('Property Type', 'type')}
            {textRow('Building/Development Name', 'building')}
            <div className="mb-12"></div>
            {bedroomRow()}
            {bathroomRow()}
            {receptionRow()}
            <div className="mb-10"></div>
            {textRow('Area (sq ft)', 'area')}
            {textRow('Available from', 'available')}
            {selectField('Furnished', 'furnishing', ['furnished', 'unfurnished'])}
            {textArea('Property Characteristics', 'features')}
            {textArea('Key highlights', 'key_highlights')}

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

