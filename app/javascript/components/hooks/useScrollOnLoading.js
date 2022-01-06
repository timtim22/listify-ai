import React, { useEffect } from 'react';

const useScrollOnLoading = (loading) => {
  useEffect(() => {
    if (loading) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [loading]);
}

export default useScrollOnLoading;
