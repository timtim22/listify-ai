import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TaskRerunButton from './TaskRerunButton';
import ResultList from '../common/ResultList';
import RequestCounter from '../common/RequestCounter';
import resultsEmptyState from '../../../assets/images/resultsEmptyState.png'; // with import


const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

  const noResultsContent = () => {
    if (!loading) {
      return (
        <>
          <img className="mx-auto" src={resultsEmptyState} alt="see results here" width="200" height="200"></img>
          <h1 className="mt-10 text-xl font-medium tracking-wider text-gray-700">Nothing to see yet</h1>
          <p className="my-2 text-sm tracking-wider text-gray-700">Create a new listing to see our generated results here</p>
        </>
      )
    }
  }

  if (results.length > 0) {
    return (
      <div className="w-full h-full">
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
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="overflow-scroll w-full h-screen">
        <div className="flex flex-col items-center py-4 pt-24 w-full h-full">
          {noResultsContent()}
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
    )
  }
}

export default Results;
