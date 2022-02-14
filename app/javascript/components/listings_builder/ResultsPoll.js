import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRequest } from '../../helpers/requests';
import IntervalTimer from '../common/IntervalTimer';

const pollInterval = 3;

const ResultsPoll = ({ taskRun, onResult }) => {
  const [polling, setPolling] = useState(false);
  const [results, setResults] = useState([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [expectedResultType, setExpectedResultType] = useState(null);

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

  // stop, no result received and user has waited 25 seconds
  useEffect(() => {
    if (polling && taskRun && secondsElapsed > 25) {
      setResults([errorResult()])
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
        `/listing_builder_task_results.json?task_run_id=${taskRun.id}`,
        (response) => {setResponseInState(response)},
        (e) => { console.log(e);  }
      )
    }
  }

  const setResponseInState = (response) => {
    const { result_type, task_results } = response;
    if (expectedResultType !== result_type) {
      setExpectedResultType(result_type)
    }
    if (task_results && task_results.length > 0) {
      setResults(task_results);
    }
  };

  const errorResult = () => {
    return {
      id: 1,
      request_type: expectedResultType,
      task_run_id: taskRun.id,
      result_text: null,
      success: false
    }
  };

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
