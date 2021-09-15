import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import Results from '../inputs/Results';

const New = ({ promptSets }) => {
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);

  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [results])



  const handleNewResults = (response) => {
    setTaskRun(response.data.task_run);
    setResults(response.data.task_results);
  }

  return (
    <>
      <Form
      promptSets={promptSets.prompt_sets}
      onResult={handleNewResults}
      />
      <Results
        results={results}
        taskRun={taskRun}
        onRerun={handleNewResults}
      />
    </>
  )
}

export default New;
