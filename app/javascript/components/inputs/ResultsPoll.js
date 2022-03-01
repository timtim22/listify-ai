import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRequest } from '../../helpers/requests';
import IntervalTimer from '../common/IntervalTimer';

const pollInterval = 3;

const ResultsPoll = ({ taskRun, onResult }) => {
  const [polling, setPolling] = useState(false);
  const [results, setResults] = useState([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // start polling
  useEffect(() => {
    if (taskRun && !polling) {
      setResults([]);
      setPolling(true);
    }
  }, [taskRun]);

  // stop, all results received
  useEffect(() => {
    if (polling && taskRun && results.length >= taskRun.expected_results) {
      endPolling();
    }
  }, [results]);

  // stop, some results received and user has waited 25 seconds
  useEffect(() => {
    if (polling && taskRun && results.length >= 1 && secondsElapsed > 25) {
      endPolling();
    }
  }, [secondsElapsed]);

  const endPolling = () => {
    setPolling(false);
    setSecondsElapsed(0);
    onResult(results);
  }

  const fetchResults = () => {
    setSecondsElapsed(secondsElapsed + pollInterval);
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
        triggerSeconds={pollInterval}
        callback={fetchResults}
      />
    )
  } else {
    return null;
  }
}

ResultsPoll.propTypes = {
  taskRun: PropTypes.object,
  onResult: PropTypes.func
}

export default ResultsPoll;
