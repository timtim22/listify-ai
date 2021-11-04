import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResultItem from '../common/ResultItem';

const AreaResults = ({ results }) => {

  const resultsList = () => {
    if (results.some(r => r.result_text)) {
      return results.map(result => <ResultItem key={result.id} result={result} />)
    }
  }

  if (results.length > 0) {
    return resultsList();
  } else {
    return null;
  }
}

export default AreaResults;
