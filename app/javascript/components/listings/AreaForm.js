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
  shouldGenerateFragment
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
      <div className="self-center w-4/5 text-sm">
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
        shouldGenerateFragment={shouldGenerateFragment}
      />
    </>
  )
}

AreaForm.propTypes = {
  runsRemaining: PropTypes.number,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  results: PropTypes.array,
  setResults: PropTypes.func,
  handleTaskRun: PropTypes.func,
  shouldGenerateFragment: PropTypes.bool
}

export default AreaForm;
