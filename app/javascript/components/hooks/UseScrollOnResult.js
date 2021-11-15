import React, { useEffect } from 'react';

const useScrollOnResult = (results) => {
  useEffect(() => {
    if (results.length > 0) {
      console.log(results)
      window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }
  }, [results]);
}

export default useScrollOnResult;
