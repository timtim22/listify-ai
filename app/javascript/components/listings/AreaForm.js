import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import ResultItem from '../common/ResultItem';
import ErrorNotice from '../common/ErrorNotice';
import AreaDescriptionForm from './AreaDescriptionForm';
import AreaSearchForm from './AreaSearchForm';
import AreaResults from './AreaResults';

const newDescriptionParams = { selectedIds: [], detailText: '' };

const AreaForm = ({
  runsRemaining,
  setRunsRemaining,
  loading,
  setLoading,
  results,
  setResults,
  taskRun,
  handleTaskRun
}) => {
  const [errors, setErrors] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [descriptionParams, setDescriptionParams] = useState(newDescriptionParams);

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

  return (
    <>
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
        descriptionParams={descriptionParams}
        setDescriptionParams={setDescriptionParams}
        handleTaskRun={handleTaskRun}
        runsRemaining={runsRemaining}
        loading={loading}
        setLoading={setLoading}
        setErrors={setErrors}
      />
    </>
  )
}

export default AreaForm;
