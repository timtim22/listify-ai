import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import { UserContext } from './New';

const AreaSearchForm = ({
  loading,
  setLoading,
  setSearchResult,
  setErrors,
  shouldGenerateFragment
}) => {

  const [inputFields, setInputFields] = useState({ search_text: '' });
  const user = useContext(UserContext);

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

  const onEnterPress = (e) => {
    if (e.key !== 'Enter') { return }
    if (!isAscii(inputFields.search_text)) {
      e.preventDefault();
    }
  };


  const textRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center my-2 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => {setField(key, e.target.value)}}
          onKeyPress={(e) => onEnterPress(e)}
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const asciiWarning = () => {
    return (
      <p className="mt-4 text-sm text-red-700">
        Sorry, your text contains a language character we can't process. Try typing the location if you've copied and pasted from another site.
      </p>
    )
  }

  const isAscii = (str) => {
    return /^[\x00-\x7F]*$/.test(str);
  }

  const areaSearchDisabled = () => {
    return (
      loading ||
      user.account_locked ||
      ["lapsed_trial", "lapsed_subscription"].includes(user.account_status)
    )
  };

  const submitButton = () => {
    const disabled = areaSearchDisabled();
    return (
      <button disabled={disabled} className={`${disabled ? "cursor-not-allowed opacity-50" : ""} primary-button`}>
        Search
      </button>
    )
  }

  return (
    <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
      <div className={`flex flex-col w-4/5 max-w-2xl ${shouldGenerateFragment ? "w-full" : "w-4/5"}`}>
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

AreaSearchForm.propTypes = {
  setSearchResult: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  setErrors: PropTypes.func,
  shouldGenerateFragment: PropTypes.bool,
}

export default AreaSearchForm;
