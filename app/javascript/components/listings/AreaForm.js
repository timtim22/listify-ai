import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError, useScrollOnResult } from '../hooks';
import ResultItem from '../common/ResultItem';
import ErrorNotice from '../common/ErrorNotice';
import ResultsPoll from '../inputs/ResultsPoll';
import AreaDescriptionForm from './AreaDescriptionForm';
import AreaSearchForm from './AreaSearchForm';
import AreaResults from './AreaResults';
import Results from '../inputs/Results';

const newDescriptionParams = { selectedIds: [], detailText: '' };

const AreaForm = ({ runsRemaining, setRunsRemaining }) => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [descriptionParams, setDescriptionParams] = useState(newDescriptionParams);
  const [descriptionResults, setDescriptionResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);

  const onError = useScrollToTopOnError(errors);
  const onResult = useScrollOnResult(descriptionResults);

  useEffect(() => {
    if (!searchResult && descriptionParams.selectedIds.length > 0) {
      setDescriptionParams(newDescriptionParams);
    }
  }, [searchResult]);

  useEffect(() => {
    if (descriptionResults.length > 0) {
      setDescriptionResults([]);
    }
  }, [descriptionParams]);

  const handleDescriptionResults = (newResults) => {
    const newList = [...descriptionResults, ...newResults];
    setDescriptionResults(newList);
    setLoading(false);
  }

  const handleTaskRun = (response) => {
    setErrors(null);
    setRunsRemaining(response.data.runs_remaining);
    setTaskRun(response.data.task_run)
  }

  return (
    <div class="flex flex-wrap overflow-hidden">
      <div class="w-full md:w-1/2 overflow-hidden border-r-2">
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
      </div>

      <div class="w-full md:w-1/2 overflow-hidden">
        <ResultsPoll
          taskRun={taskRun}
          onResult={handleDescriptionResults}
        />
        <Results
          loading={loading}
          setLoading={(state) => setLoading(state)}
          runsRemaining={runsRemaining}
          results={descriptionResults}
          taskRun={taskRun}
          onRerun={handleTaskRun}
        />
        />
      </div>
    </div>
  )
}

export default AreaForm;
