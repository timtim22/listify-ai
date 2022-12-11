import React, { useContext, useState } from 'react';
import { UserContext } from '../listings/New';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';

const SearchForm = ({ canCloseSearch, loading, setLoading, initialSearchTerm, setSearchOpen, setSearchResult }) => {
  const [errors, setErrors] = useState(null);
  const [inputFields, setInputFields] = useState({ search_text: initialSearchTerm, attraction_radius: 5000 });

  const user = useContext(UserContext);

  const setField = (field, value) => {
    setErrors(null);
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
      "Sorry - our search provider cannot handle certain language characters. Try typing the location if you have copied and pasted from another site."
    )
  }

  const isAscii = (str) => {
    return /^[\x00-\x7F]*$/.test(str);
  }

  const couldNotFindPlace = () => {
    return errors.data && errors.data.no_results;
  };

  const handleServerSideError = () => {
    if (couldNotFindPlace()) {
      return <p className="text-sm text-red-700">{errors.data.no_results[0]}</p>
    }
    return (
      <div className="self-center w-full text-sm">
        <ErrorNotice errors={errors} />
      </div>
    )
  };

  const submitButton = () => {
    if (errors) {
      return handleServerSideError();
    } else if (!isAscii(inputFields.search_text)) {
      return <p className="text-sm text-red-700">{asciiWarning()}</p>
    }
    return (
      <div className="flex flex-col items-center">
        <button
          disabled={cannotSearch()}
          type="button"
          onClick={handleSubmit}
          className={cannotSearch() ? "disabled-primary-button" : "primary-button"}
        >
          Search
        </button>
        {closeSearchLink()}
      </div>
    )
  }

  const cannotSearch = () => {
    return (
      loading ||
      ["lapsed_trial", "lapsed_subscription"].includes(user.account_status) ||
      inputFields.search_text.length <3
    )
  };

  const closeSearchLink = () => {
    if (canCloseSearch) {
      return (
        <span
          onClick={() => setSearchOpen(false)}
          className="cursor-pointer text-xs text-purple-700 mt-4 font-medium"
        >
          Close search
        </span>
      )
    }
  };

  const radiusCheckbox = (value, title) => {
    return (
      <div className="flex items-center mr-3">
        <input
          id="5000"
          name="notification-method"
          type="radio"
          checked={inputFields.attraction_radius === value}
          onChange={() => setField('attraction_radius', value)}
          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"></input>
        <label className="ml-2 block text-sm font-medium text-gray-700">{title}</label>
      </div>
    )
  };

  const radiusController = () => {
    return (
      <div className="flex justify-start items-center my-4 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm">Radius</label>
        <div className="flex items-center justify-start mx-4">
          {radiusCheckbox(2000, '2km')}
          {radiusCheckbox(5000, '5km')}
          {radiusCheckbox(25000, '25km')}
        </div>
      </div>
    )
  };

  return (
    <div className="bg-gray-50 w-full self-center border border-gray-200 rounded-lg">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col w-4/5 max-w-2xl">
          <div className="w-full flex justify-center items-center py-4">
            <h2 className="text-lg font-medium">Search</h2>
          </div>
          {textRow('Search Area','search_text','e.g. Waterloo, London', true)}
          {radiusController()}
          <div className="flex justify-center py-8 w-full">
            {submitButton()}
          </div>
        </div>
      </div>
    </div>
  )
};

SearchForm.propTypes = {
  canCloseSearch: PropTypes.bool,
  initialSearchTerm: PropTypes.string,
  loading: PropTypes.bool,
  setErrors: PropTypes.func,
  setLoading: PropTypes.func,
  setSearchOpen: PropTypes.func,
  setSearchResult: PropTypes.func
}

export default SearchForm;
