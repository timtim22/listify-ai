import React from 'react';
import PropTypes from 'prop-types';
import TaskRerunButton from './TaskRerunButton';
import ResultList from '../common/ResultList';
import RequestCounter from '../common/RequestCounter';
import NoResultsContent from '../common/NoResultsContent';
import GeneratingSpinner from '../common/GeneratingSpinner';

const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

  if (results.length > 0) {
    return (
      <div className="w-full h-full">
        <div className="flex flex-col items-center mb-4 w-full">
          <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Results</h1>
          <div className="flex flex-col items-center py-4 w-full">
            <ResultList results={results} />
            <div className="flex justify-center py-8 w-full">
              <TaskRerunButton
                runsRemaining={runsRemaining}
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
      <>
        <NoResultsContent visible={!loading} />
        {loading && <div className="py-32"><GeneratingSpinner /></div>}
      </>
    )
  }
}

export default Results;
