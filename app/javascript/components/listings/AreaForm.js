import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import ErrorNotice from '../common/ErrorNotice';
import AreaDescriptionForm from './AreaDescriptionForm';
import AreaSearchForm from './AreaSearchForm';

const newDescriptionParams = { selectedIds: [], detailText: '' };

const AreaForm = ({
  runsRemaining,
  loading,
  setLoading,
  results,
  setResults,
  handleTaskRun,
  shouldGenerateFragment,
  onFragmentResponse
}) => {
  const [errors, setErrors] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [descriptionParams, setDescriptionParams] = useState(newDescriptionParams);
  const [formVisible, setFormVisible] = useState('search_form');

  const onError = useScrollToTopOnError(errors);

  useEffect(() => {
    if (!searchResult && descriptionParams.selectedIds.length > 0) {
      setDescriptionParams(newDescriptionParams);
    }
  }, [searchResult]);

  useEffect(() => {
    if (results.length > 0) {
      setResults([]);
    }
  }, [descriptionParams]);

  const handleSearchResult = (newResult) => {
    setSearchResult(newResult);
    if (newResult !== null) { setFormVisible('description_form') }
  };

  const resetForm = () => {
    setSearchResult(null);
    setDescriptionParams(newDescriptionParams);
    setFormVisible('search_form');
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="self-center w-4/5 text-sm">
        <ErrorNotice errors={errors} />
      </div>
      {formVisible === 'search_form' && <AreaSearchForm
        setSearchResult={handleSearchResult}
        loading={loading}
        setLoading={setLoading}
        errors={errors}
        setErrors={setErrors}
        shouldGenerateFragment={shouldGenerateFragment}
      />}
      {formVisible === 'description_form' && <AreaDescriptionForm
        searchResult={searchResult}
        descriptionParams={descriptionParams}
        setDescriptionParams={setDescriptionParams}
        handleTaskRun={handleTaskRun}
        runsRemaining={runsRemaining}
        loading={loading}
        setLoading={setLoading}
        setErrors={setErrors}
        resetForm={resetForm}
        shouldGenerateFragment={shouldGenerateFragment}
        onFragmentResponse={onFragmentResponse}
      />}
    </div>
  )
}

AreaForm.propTypes = {
  runsRemaining: PropTypes.number,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  results: PropTypes.array,
  setResults: PropTypes.func,
  handleTaskRun: PropTypes.func,
  shouldGenerateFragment: PropTypes.bool,
  onFragmentResponse: PropTypes.func
}

export default AreaForm;
