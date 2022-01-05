import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RequestCounter from '../common/RequestCounter';
import ResultList from '../common/ResultList';
import FullListingPoll from './FullListingPoll';

const FullListingResults = ({ results, setResults, setLoading, runsRemaining }) => {
  const [errors, setErrors] = useState(null);

  const fullListingPoll = () => {
    return (
      <FullListingPoll
        fullListing={results[0]}
        onComplete={(completedListing) => { setResults([completedListing]); setLoading(false) }}
        onError={setErrors}
      />
    )
  }

  const showResults = () => {
    if (results[0] && results[0].text !== "") {
      const formattedResults = [{
        id: results[0].id,
        object_type: "FullListing",
        result_text: results[0].text
      }]
      return (
        <div className="flex flex-col items-center py-8 w-full">
          <ResultList results={formattedResults} />
          <RequestCounter runsRemaining={runsRemaining} />
        </div>
      )
    }
  }

  return (
    <>
      {fullListingPoll()}
      {showResults()}
    </>
  )



}

export default FullListingResults;
