import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FeedbackForm from '../feedbacks/Form';
import TaskRerunButton from './TaskRerunButton';
import ResultList from '../common/ResultList';
import RequestCounter from '../common/RequestCounter';
import resultsEmptyState from '../../../assets/images/resultsEmptyState.png'; // with import


const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

  if (results.length > 0) {
    return (
      <div className="w-full md:w-1/2 h-full md:absolute top-12">
        <div className="flex flex-col items-center mb-4 w-full">
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
    return (
      <div className="w-full md:w-1/2 h-full md:absolute top-12">
        <div className="flex flex-col items-center mb-4 w-full ">
          <div className="flex flex-col items-center py-4 w-full">
            <div class="pt-12 py-12 text-center">
              <img class="mx-auto" src={resultsEmptyState} alt="see results here" width="200" height="200"></img>
              <h1 className="mt-10 text-xl font-medium tracking-wider text-gray-700">Nothing to see yet</h1>
              <p className="my-2 tracking-wider text-sm text-gray-700">Create a new listing to see our generated results here</p>
            </div>
            <div className="flex justify-center py-8 w-full">
              <TaskRerunButton
                loading={loading}
                setLoading={setLoading}
                taskRun={taskRun}
                hideButton={true}
                onResult={onRerun}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Results;
