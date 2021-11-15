import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import ResultItem from '../common/ResultItem';
import ErrorNotice from '../common/ErrorNotice';
import ResultsPoll from '../inputs/ResultsPoll';
import AreaDescriptionForm from './AreaDescriptionForm';
import AreaSearchForm from './AreaSearchForm';
import AreaResults from './AreaResults';

const AreaForm = () => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [descriptionResults, setDescriptionResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);

  const onError = useScrollToTopOnError(errors);

  useEffect(() => {
    if (descriptionResults.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [descriptionResults]);

  useEffect(() => {
    if (!searchResult && selectedIds) {
      setSelectedIds([]);
    }
  }, [searchResult]);

  useEffect(() => {
    if (descriptionResults.length > 0) {
      setDescriptionResults([]);
    }
  }, [selectedIds]);

  const handleDescriptionResults = (newResults) => {
    const newList = [...descriptionResults, ...newResults];
    setDescriptionResults(newList);
    setLoading(false);
  }

  const handleTaskRun = (response) => {
    setErrors(null);
    setDescriptionResults(response.data.task_run.text_results)
    setTaskRun(response.data.task_run)
  }

  return (
    <div className="flex flex-col items-center mb-8 w-full">
      <div className="mb-px w-full h-8"></div>
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
        handleTaskRun={handleTaskRun}
        loading={loading}
        setLoading={setLoading}
        setErrors={setErrors}
      />
      <ResultsPoll
        taskRun={taskRun}
        onResult={handleDescriptionResults}
      />
      <AreaResults
        taskRun={taskRun}
        results={descriptionResults}
      />
    </div>
  )
}

export default AreaForm;
