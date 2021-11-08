import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResultList from '../common/ResultList';

const AreaResults = ({ results, taskRun }) => {

  const noResultsExpected = () => {
    return taskRun.expected_results === 0;
  }

  const resultsPresent = () => {
    return results.length > taskRun.text_results.length;
  }

  const taskResultsPresent = () => {
    return taskRun && (noResultsExpected() || resultsPresent());
  }

  if (taskResultsPresent()) {
    return <ResultList results={results} />
  } else {
    return null;
  }
}

export default AreaResults;
