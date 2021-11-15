import React, { useEffect } from 'react';

const useScrollToTopOnError = (errors) => {
  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors]);
}

export default useScrollToTopOnError;
