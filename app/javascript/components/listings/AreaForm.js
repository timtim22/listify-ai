import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors]);

  useEffect(() => {
    if (descriptionResults.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [descriptionResults]);

  useEffect(() => {
    if (!searchResult && selectedIds) {
      setSelectedIds([]);
      setDescriptionResults([]);
    }
  }, [searchResult]);


  const resetDescriptionResults = () => {
    setDescriptionResults([]);
  }

  const handleNewResults = (newResults) => {
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
        descriptionResults={descriptionResults}
        resetDescriptionResults={resetDescriptionResults}
        handleTaskRun={handleTaskRun}
        loading={loading}
        setLoading={setLoading}
        setErrors={setErrors}
      />
      <ResultsPoll
        taskRun={taskRun}
        onResult={handleNewResults}
      />
      <AreaResults
        taskRun={taskRun}
        results={descriptionResults}
      />
    </div>
  )
}

export default AreaForm;
