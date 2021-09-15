import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FeedbackForm from '../feedbacks/Form';
import TaskRerunButton from './TaskRerunButton';

const Results = ({ runsRemaining, results, taskRun, onRerun }) => {

  const renderResult = (result) => {
    return (
      <div
        key={result.id}
        className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200"
      >
        <p>{result.result_text}</p>
        <br />
        {tags(result)}
     </div>
    )
  }

  const tags = (result) => {
    if (result.prompt_labels && result.prompt_labels.length > 0) {
      return (
        <p className="text-xs font-medium text-gray-500">Tags: {result.prompt_labels}</p>
      )
    }
  }

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
            {results.map(result => renderResult(result))}
            <div className="flex justify-center py-8 w-full">
              <TaskRerunButton taskRun={taskRun} onResult={onRerun} />
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
