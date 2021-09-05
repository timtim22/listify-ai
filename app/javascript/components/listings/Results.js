import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Results = ({ results }) => {

  const renderResult = (result) => {
    return (
      <div
        key={result.id}
        className="py-3 px-4 mb-4 w-4/5 bg-green-50 rounded-lg border border-gray-200"
      >
        <p>{result.result_text}</p>
        <br />
        {tags(result)}
     </div>
    )
  }

  const tags = (result) => {
    if (result.prompt_labels && result.prompt_labels.length > 0) {
      return (
        <p className="text-xs font-medium text-gray-500">Tags: {result.prompt_labels}</p>
      )
    }
  }

  if (results.length > 0) {
    return (
      <div className="w-full h-full">
        <div className="flex flex-col items-center mb-4 w-full">
          <div className="mt-4 mb-4 w-3/4 h-px bg-gray-300"></div>
          <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Results</h1>
          <div className="flex flex-col items-center py-4 w-full">
            {results.map(result => renderResult(result))}
          </div>
        </div>
      </div>
    )
  } else {
    return null;
  }

}

export default Results;
