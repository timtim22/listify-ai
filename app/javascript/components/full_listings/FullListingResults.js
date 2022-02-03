import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RequestCounter from '../common/RequestCounter';
import ResultList from '../common/ResultList';
import NoResultsContent from '../common/NoResultsContent';
import GeneratingSpinner from '../common/GeneratingSpinner';

const FullListingResults = ({ results, loading, runsRemaining }) => {

  const resultPresent = () => {
    return results[0] && results[0].text !== "";
  }

  const showResults = () => {
    if (resultPresent()) {
      const formattedResults = [{
        id: results[0].id,
        object_type: "FullListing",
        result_text: results[0].text
      }]
      return (
        <div className="flex flex-col items-center h-full w-full">
          <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Results</h1>
          <div className="flex flex-col items-center py-4 w-full">
            <ResultList results={formattedResults} />
            <RequestCounter runsRemaining={runsRemaining} />
          </div>
        </div>
      )
    }
  }

  if (loading) { return <div className="py-24"><GeneratingSpinner /></div>; }
  if (resultPresent()) { return showResults()}
  return <NoResultsContent visible={true} />;
}

export default FullListingResults;
