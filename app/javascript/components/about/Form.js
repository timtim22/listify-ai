import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';
import InlineAreaForm from './InlineAreaForm';

const newInputFields = {
  request_type: 'brand_description',
  brand_name: '',
  brand_details: '',
  property_details: '',
  location_details: '',
  location: '',
  attractions: []
}

const maxInput = 800;

const Form = ({ loading, setLoading, onResult, runsRemaining }) => {
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
      "/brand_descriptions.json",
      { brand_description: inputFields },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const joinedInputs = () => {
    const inputs = { ...inputFields, attractions: '' };
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

  const textAreaField = (title, key, placeholder) => {
    return (
      <div className="flex items-start w-full mt-2">
        <label className="flex-shrink-0 mt-2 w-1/3">{title}</label>
        <div className="px-3 w-full">
          <TextareaWithPlaceholder
            value={inputFields[key]}
            onChange={(value) => setField(key, value)}
            heightClass={"h-16"}
            customClasses={"text-sm"}
            placeholderContent={placeholder} />
        </div>
      </div>
    )
  };

  return (
    <div className="flex flex-col items-center w-full text-sm">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="self-center w-4/5 text-sm">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {textRow('Business name', 'brand_name', 'e.g. Sunrise Holidays', true)}
          {textAreaField('About the business', 'brand_details', 'e.g. family run business, founded 2011' )}
          {textAreaField('About the properties', 'property_details', 'e.g. fully furnished apartments with TV, free Wifi...')}
          <div className="mb-4 mt-8 w-full h-px bg-gray-200"></div>
          {textRow('Location', 'location', 'e.g. Bristol, UK', true)}
          {textAreaField('Location details', 'location_details', 'e.g. in the north of the city, close to bars and restaurants')}
          <InlineAreaForm
            location={inputFields['location']}
            loading={loading}
            setLoading={setLoading}
            setParentField={setField}
          />
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

Form.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
  runsRemaining: PropTypes.number
}

export default Form;
