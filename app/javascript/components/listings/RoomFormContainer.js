import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Results from '../inputs/Results';
import ResultsPoll from '../inputs/ResultsPoll';
import Form from './RoomForm';

const RoomFormContainer = ({ showExample, runsRemaining, setRunsRemaining, formType }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);

  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [results])

  const handleNewResults = (newResults) => {
    const newList = taskRun.is_rerun ? [...results, ...newResults] : newResults;
    setResults(newList);
    setLoading(false);
  }

  const handleTaskRun = (response) => {
    setRunsRemaining(response.data.runs_remaining);
    setTaskRun(response.data.task_run);
  }

  return (
    <>
      <Form
        loading={loading}
        setLoading={(state) => setLoading(state)}
        formType={formType}
        runsRemaining={runsRemaining}
        onResult={handleTaskRun}
        showExample={showExample}
      />
      <ResultsPoll
        taskRun={taskRun}
        onResult={handleNewResults}
      />
      <Results
        loading={loading}
        setLoading={(state) => setLoading(state)}
        runsRemaining={runsRemaining}
        results={results}
        taskRun={taskRun}
        onRerun={handleTaskRun}
      />
    </>
  )
}

export default RoomFormContainer;
