import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import Results from '../inputs/Results';
import ResultsPoll from '../inputs/ResultsPoll';

const New = ({ templateListing, initialRunsRemaining }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);
  const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);

  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [results])

  const handleNewResults = (results) => {
    setResults(results);
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
        runsRemaining={runsRemaining}
        onResult={handleTaskRun}
        templateListing={templateListing}
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

export default New;
