import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ResultItem from '../common/ResultItem';
import ErrorNotice from '../common/ErrorNotice';
import AreaDescriptionForm from './AreaDescriptionForm';
import AreaSearchForm from './AreaSearchForm';

const AreaForm = () => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [descriptionResult, setDescriptionResult] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors]);

  useEffect(() => {
    if (descriptionResult) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [descriptionResult]);

  useEffect(() => {
    if (!searchResult && selectedIds) {
      setSelectedIds([]);
      setDescriptionResult(null);
    }
  }, [searchResult]);

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div className="w-full h-8 mb-px"></div>
      <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      <div className="w-4/5">
        <ErrorNotice errors={errors} />
      </div>
      <AreaSearchForm
        setSearchResult={setSearchResult}
        loading={loading}
        setLoading={setLoading}
        errors={errors}
        setErrors={setErrors}
      />
      <AreaDescriptionForm
        searchResult={searchResult}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        descriptionResult={descriptionResult}
        setDescriptionResult={setDescriptionResult}
        loading={loading}
        setLoading={setLoading}
        setErrors={setErrors}
      />
      {searchResult && descriptionResult &&
      <ResultItem result={{ result_text: descriptionResult }} />}
    </div>
  )
}

export default AreaForm;
