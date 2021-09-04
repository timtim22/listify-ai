import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import Results from './Results';

const New = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [results])



  const handleNewResults = (response) => {
    setResults(response.data.task_results);
  }

  return (
    <>
      <Form onResult={handleNewResults} />
      <Results results={results} />
    </>
  )

}

export default New;
