import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResultList from '../common/ResultList';
import RequestCounter from '../common/RequestCounter';

const AreaResults = ({ runsRemaining, results, taskRun }) => {

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
    return (
      <div className="flex flex-col items-center py-4 w-full">
        <ResultList results={results} />
        <div className="flex justify-center py-8 w-full">
          <RequestCounter runsRemaining={runsRemaining} />
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default AreaResults;
