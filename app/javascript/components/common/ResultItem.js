import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CopyButton from './CopyButton';

const ResultItem = ({ result }) => {

  const tags = (result) => {
    let text = "";
    if (result.prompt_labels && result.prompt_labels.length > 0) {
      text = `Tags: ${result.prompt_labels}`;
    }
    return (
      <p className="text-xs font-medium text-gray-500">{text}</p>
    )
  }

  const resultText = result.result_text ? result.result_text.trim() : "";
  if (resultText !== "") {
    return (
      <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
        <p>{resultText}</p>
        <br />
        <div className="flex justify-between items-center">
          {tags(result)}
          <CopyButton result={result} />
        </div>
     </div>
    )
  }
}

export default ResultItem;
