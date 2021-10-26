import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FeedbackForm from '../feedbacks/Form';
import TaskRerunButton from './TaskRerunButton';
import CopyButton from '../common/CopyButton';

const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

  const resultsList = () => {
    if (results.some(r => r.result_text)) {
      return results.map(result => renderResult(result))
    } else {
      return (
        <div className="flex justify-center py-8 w-full">
          <p className="text-sm">Hm, this query didn't generate any valid results. Sorry about that - we will look into it.</p>
        </div>
      )
    }
  }

  const renderResult = (result) => {
    const resultText = result.result_text ? result.result_text.trim() : "";
    if (resultText !== "") {
      return (
        <div
          key={result.id}
          className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200"
        >
          <p>{resultText}</p>
          <br />
          <div className="flex justify-between items-center">
            {tags(result)}
            <CopyButton result={result} />
          </div>
       </div>
      )
    }
  }

  const tags = (result) => {
    let text = "";
    if (result.prompt_labels && result.prompt_labels.length > 0) {
      text = `Tags: ${result.prompt_labels}`;
    }
    return (
      <p className="text-xs font-medium text-gray-500">{text}</p>
    )
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
            {resultsList()}
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
