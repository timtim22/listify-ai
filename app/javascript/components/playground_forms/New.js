import React, { useState } from 'react';
import Form from './Form';
import Results from '../inputs/Results';
import ResultsPoll from '../inputs/ResultsPoll';

const New = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);
  const [runsRemaining, setRunsRemaining] = useState(20);

  const handleNewResults = (newResults) => {
    const newList = taskRun.is_rerun ? [...results, ...newResults] : newResults;
    setResults(newList);
    setLoading(false);
  }

  const handleTaskRun = (response) => {
    setTaskRun(response.data.task_run);
  }

  return (
    <>
      <Form
        loading={loading}
        setLoading={(state) => setLoading(state)}
        runsRemaining={runsRemaining}
        onResult={handleTaskRun}
      />
      <ResultsPoll
        taskRun={taskRun}
        onResult={handleNewResults}
      />

      <Results
        results={results}
        taskRun={taskRun}
        onRerun={handleTaskRun}
        loading={loading}
        setLoading={(state) => setLoading(state)}
        runsRemaining={runsRemaining}
        playgroundMode={true}
      />
    </>
  )
}

export default New;

