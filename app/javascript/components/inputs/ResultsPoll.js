import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRequest } from '../../helpers/requests';
import IntervalTimer from '../common/IntervalTimer';

const ResultsPoll = ({ taskRun, onResult }) => {
  const [polling, setPolling] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (taskRun && !polling) {
      setResults([]);
      setPolling(true);
    }
  }, [taskRun]);

  useEffect(() => {
    if (polling && taskRun && results.length >= taskRun.expected_results) {
      setPolling(false);
      onResult(results);
    }
  }, [results]);

  const fetchResults = () => {
    if (taskRun) {
      getRequest(
        `/task_runs/${taskRun.id}/task_results.json`,
        (response) => { setResults(response) },
        (e) => { setErrors(e);  }
      )
    }
  }

  if (polling) {
    return (
      <IntervalTimer
        triggerSeconds={3}
        callback={fetchResults}
      />
    )
  } else {
    return null;
  }
}

export default ResultsPoll;
