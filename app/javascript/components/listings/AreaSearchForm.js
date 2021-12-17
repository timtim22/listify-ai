import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import GeneratingSpinner from '../common/GeneratingSpinner';

const AreaSearchForm = ({ setSearchResult, loading, setLoading, errors, setErrors }) => {
  const [inputFields, setInputFields] = useState({ search_text: '' });

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setLoading(false);
    setErrors(null);

    setSearchResult({
      id: response.data.search_location.id,
      attractions: response.data.attractions
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchResult(null);
    createRequest(
      "/search_locations.json",
      {search_location: inputFields },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false); }
    )
  }

  const textRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => {setField(key, e.target.value)}}
          className="w-full form-inline-field"
        />
      </div>
    )
  }

  const asciiWarning = (str) => {
    return (
      <p className="text-red-700 text-sm mt-4">
        Sorry, your text contains a language character we can't process. Try typing the location if you've copied and pasted from another site.
      </p>
    )
  }

  const isAscii = (str) => {
    return /^[\x00-\x7F]*$/.test(str);
  }

  const submitButton = () => {
    if (loading) { return <GeneratingSpinner />; }
    return (
      <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
        Search!
      </button>
    )
  }

  return (
    <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col w-4/5 max-w-2xl">
       {textRow('Location name','search_text','e.g. Waterloo, London', true)}
       {!isAscii(inputFields['search_text']) && asciiWarning()}
        {isAscii(inputFields['search_text']) &&
          <div className="flex justify-center py-8 w-full">
            {submitButton()}
          </div>
        }
      </div>
    </form>
  )
}

export default AreaSearchForm;
