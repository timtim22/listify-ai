import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import Results from '../inputs/Results';

const New = ({ templateListing, initialRunsRemaining, betaFeatures }) => {
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);
  const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);

  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [results])



  const handleNewResults = (response) => {
    setRunsRemaining(response.data.runs_remaining);
    setTaskRun(response.data.task_run);
    setResults(response.data.task_results);
  }

  return (
    <>
      <Form
        runsRemaining={runsRemaining}
        onResult={handleNewResults}
        templateListing={templateListing}
        betaFeatures={betaFeatures}
      />
      <Results
        runsRemaining={runsRemaining}
        results={results}
        taskRun={taskRun}
        onRerun={handleNewResults}
      />
    </>
  )
}

export default New;
