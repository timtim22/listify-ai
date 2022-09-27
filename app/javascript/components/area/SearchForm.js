import React, { useContext, useState } from 'react';
import { UserContext } from '../listings/New';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';

const SearchForm = ({ loading, setLoading, initialSearchTerm, setSearchResult }) => {
  const [errors, setErrors] = useState(null);
  const [inputFields, setInputFields] = useState({ search_text: initialSearchTerm });

  const user = useContext(UserContext);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setLoading(false);
    setErrors(null);
    setSearchResult({
      search_location_id: response.data.search_location.id,
      ...response.data.attractions
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/search_locations.json",
      {search_location: inputFields },
      (response) => { handleRequestSuccess(response) },
      (e) => { console.log(e); setErrors(e); setLoading(false); }
    )
  }

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
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const asciiWarning = () => {
    return (
      <p className="mt-4 text-sm text-red-700">
        Sorry, your text contains a language character we cannot process. Try typing the location if you have copied and pasted from another site.
      </p>
    )
  }

  const isAscii = (str) => {
    return /^[\x00-\x7F]*$/.test(str);
  }

  const submitButton = () => {
    const disabled = loading || ["lapsed_trial", "lapsed_subscription"].includes(user.account_status)
    return (
      <button disabled={disabled} className={`${disabled ? "cursor-not-allowed opacity-50" : ""} primary-button`}>
        Search
      </button>
    )
  }

  return (
    <div className="bg-gray-50 self-center border border-gray-100 rounded-lg w-4/5">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col w-4/5 max-w-2xl">
          <div className="w-full flex justify-center items-center py-4">
            <h2 className="text-lg font-medium">Search</h2>
          </div>
          {textRow('Search Area','search_text','e.g. Waterloo, London', true)}
          <div className="flex justify-center py-8 w-full">
            {submitButton()}
          </div>
        </div>
      </form>
    </div>
  )
};

SearchForm.propTypes = {
  setSearchResult: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  setErrors: PropTypes.func,
  initialSearchTerm: PropTypes.string
}

export default SearchForm;
