import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RequestCounter from '../common/RequestCounter';
import ResultList from '../common/ResultList';
import GeneratingSpinner from '../common/GeneratingSpinner';
import resultsEmptyState from '../../../assets/images/resultsEmptyState.png'; // with import

const FullListingResults = ({ results, loading, runsRemaining }) => {

  const resultPresent = () => {
    return results[0] && results[0].text !== "";
  }

  const noResultsContent = () => {
    if (!resultPresent()) {
      return (
        <div className="flex flex-col items-center py-4 pt-24 w-full h-full">
          <img className="mx-auto" src={resultsEmptyState} alt="see results here" width="200" height="200"></img>
          <h1 className="mt-10 text-xl font-medium tracking-wider text-gray-700">Nothing to see yet</h1>
          <p className="my-2 text-sm tracking-wider text-gray-700">Results generated by our AI will appear here.</p>
        </div>
      )
    }
  }

  const showResults = () => {
    if (resultPresent()) {
      const formattedResults = [{
        id: results[0].id,
        object_type: "FullListing",
        result_text: results[0].text
      }]
      return (
        <div className="flex flex-col items-center w-full">
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

  return (
    <div className="w-full lg:h-screen">
        {noResultsContent()}
        {showResults()}
    </div>
  )
}

export default FullListingResults;
