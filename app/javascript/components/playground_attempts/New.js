import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import Results from './Results';

const New = ({ promptSets }) => {
  const [results, setResults] = useState([]);
  const [taskRunId, setTaskRunId] = useState(null);

  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [results])



  const handleNewResults = (response) => {
    setResults(response.data.task_results);
    setTaskRunId(response.data.task_run.id);
  }

  return (
    <>
      <Form promptSets={promptSets.prompt_sets} onResult={handleNewResults} />
      <Results results={results} taskRunId={taskRunId} />
    </>
  )
}

export default New;
