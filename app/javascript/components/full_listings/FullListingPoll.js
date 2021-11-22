import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRequest } from '../../helpers/requests';
import IntervalTimer from '../common/IntervalTimer';

const FullListingPoll = ({ fullListing, onComplete, onError }) => {
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (fullListing && !fullListing.requests_completed && !polling) {
      setPolling(true);
    }
  }, [fullListing]);

  const handleResponse = (response) => {
    if (polling && response.full_listing.requests_completed) {
      setPolling(false);
      onComplete(response.full_listing);
    }
  }

  const fetchResults = () => {
    if (fullListing) {
      getRequest(
        `/full_listings/${fullListing.id}.json`,
        (response) => { handleResponse(response) },
        (error) => { onError(error);  }
      )
    }
  }

  if (polling) {
    return (
      <IntervalTimer
        triggerSeconds={3}
        callback={fetchResults}
      />
    )
  } else {
    return null;
  }
}

export default FullListingPoll;
