import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResultList from '../common/ResultList';

const AreaResults = ({ runsRemaining, results, taskRun }) => {

  const remainingRequests = () => {
    if (runsRemaining) {
      const count = runsRemaining;
      const s = count !== 1 ? 's' : '';
      const countColor = count > 5 ? "text-green-600" : "text-red-600";
      return (
        <p className="mt-4 text-sm text-gray-500">
          You have
        <span className={`${countColor} font-extrabold`}> {count} request{s} </span>
          remaining today.
        </p>
      )
    }
  }

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
          {remainingRequests()}
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default AreaResults;
