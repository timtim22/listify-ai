import React from 'react';
import PropTypes from 'prop-types';
import ResultList from '../common/ResultList';
import RequestCounter from '../common/RequestCounter';
import NoResultsContent from '../common/NoResultsContent';
import GeneratingSpinner from '../common/GeneratingSpinner';
import FragmentRefreshButton from './FragmentRefreshButton';

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const sortObjectsByDate = (array) => {
  return array.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
  });
}


const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

  const resultFragment = (results) => {
    const orderedByDate = sortObjectsByDate(results);
    console.log({orderedByDate})
    const latestTaskId = orderedByDate[orderedByDate.length-1];
    return resultItem(orderedByDate[orderedByDate.length-1]);
    //resultItem(groupedResults[key][0])
  }

  const resultItem = (result) => {
    return (
      <div key={result.id} className="flex h-full items-stretch pt-4">
        <div>
          <p className="text-sm whitespace-pre-wrap">{result.result_text}</p>
        </div>
        <div className="pl-4 pt-4 flex items-start flex-shrink-0">
          <FragmentRefreshButton
            taskRun={taskRun}
            runsRemaining={runsRemaining}
            onResult={onRerun}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    )
  }

  if (results.length > 0) {
    const groupedResults = groupBy(results, 'request_type');
    return (
      <div className="w-full h-full">
        <div className="flex flex-col items-center mb-4 w-full">
          <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Results</h1>
          <div className="flex flex-col items-center py-4 w-full">
            <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
              {Object.keys(groupedResults).map(key => resultFragment(groupedResults[key]))}
              <div className="pt-8">
                {loading && <p className="text-sm text-gray-500">Generating...</p>}
              </div>
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

