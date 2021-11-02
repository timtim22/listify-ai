import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';
import AreaDescriptionForm from './AreaDescriptionForm';
import ResultItem from '../common/ResultItem';

const AreaForm = () => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState({ search_text: '' });
  const [searchResult, setSearchResult] = useState(null);
  const [descriptionResult, setDescriptionResult] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors]);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    setSearchResult(response.data.attractions);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/search_locations.json",
      {search_location: inputFields },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
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

  const submitButton = () => {
    return (
      <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
        Search!
      </button>
    )
  }

  const toggleSelected = (placeId) => {
    if (selectedIds.includes(placeId)) {
      setSelectedIds(selectedIds.filter(id => id !== placeId));
    } else {
      setSelectedIds([ ...selectedIds, placeId ]);
    }
  }

  const showDescriptionResult = () => {
    if (descriptionResult) {
      return (
        <ResultItem result={{ result_text: descriptionResult }} />
      )
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-8 mb-px"></div>
      <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
         {textRow('Location','search_text','e.g. postcode', true)}
          <div className="flex justify-center py-8 w-full">
            {submitButton()}
          </div>
        </div>
      </form>
      <AreaDescriptionForm
        searchResult={searchResult}
        selectedIds={selectedIds}
        toggleSelected={toggleSelected}
        setDescriptionResult={setDescriptionResult}
        setErrors={setErrors}
        loading={loading}
        setLoading={setLoading}
      />
      {showDescriptionResult()}
    </div>
  )
}

export default AreaForm;
