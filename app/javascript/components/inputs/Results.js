import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FeedbackForm from '../feedbacks/Form';
import TaskRerunButton from './TaskRerunButton';
import ResultList from '../common/ResultList';
import RequestCounter from '../common/RequestCounter';

const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

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
            <RequestCounter runsRemaining={runsRemaining} />
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
