import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FeedbackForm from '../feedbacks/Form';
import TaskRerunButton from './TaskRerunButton';
import ResultList from '../common/ResultList';

const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

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

  if (results.length > 0) {
    return (
      <div className="w-full h-full">
        <div className="flex flex-col items-center mb-4 w-full">
          <div className="mt-4 mb-4 w-3/4 h-px bg-gray-300"></div>
          <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Results</h1>
          <div className="flex flex-col items-center py-4 w-full">
            <ResultList results={results} />
            <div className="flex justify-center py-8 w-full">
              <TaskRerunButton
                loading={loading}
                setLoading={setLoading}
                taskRun={taskRun}
                onResult={onRerun}
              />
            </div>
            {remainingRequests()}
            <FeedbackForm taskRunId={taskRun.id} />
          </div>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default Results;
