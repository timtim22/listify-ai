import React from 'react';
import PropTypes from 'prop-types';
import ResultItem from './ResultItem';
import PlaygroundResultItem from './PlaygroundResultItem';

const ResultList = ({ results, playgroundMode = false }) => {

  const resultItem = (result) => {
    if (playgroundMode) {
      return <PlaygroundResultItem key={result.id} result={result} />
    } else {
      return <ResultItem key={result.id} result={result} />
    }
  };

  const noResultsMessage = () => {
    return (
      <div className="flex justify-center py-8 w-full">
        <p className="text-sm">
          {`Hm, this query didn't generate any valid results. Sorry about that - we will look into it.`}
        </p>
      </div>
    )
  };

  if (results.some(r => r.result_text)) {
    return results.map(result => resultItem(result))
  } else {
    return noResultsMessage();
  }
}

ResultList.propTypes = {
  results: PropTypes.array,
  playgroundMode: PropTypes.bool
}

export default ResultList;
