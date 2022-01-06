import React, { useEffect } from 'react';

const useScrollOnResult = (results) => {
  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [results]);
}

export default useScrollOnResult;
