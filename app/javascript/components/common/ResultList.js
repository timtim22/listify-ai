import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResultItem from './ResultItem';

const ResultList = ({ results }) => {

  if (results.some(r => r.result_text)) {
    return results.map(result => <ResultItem key={result.id} result={result} />)
  } else {
    return (
      <div className="flex justify-center py-8 w-full">
        <p className="text-sm">Hm, this query didn't generate any valid results. Sorry about that - we will look into it.</p>
      </div>
    )
  }
}

export default ResultList;
