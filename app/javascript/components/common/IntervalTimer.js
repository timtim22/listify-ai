import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const IntervalTimer = ({ triggerSeconds, callback }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(duration => duration + 1)
    }, 1000);
    return () => { clearInterval(interval) };
  }, [duration])

  useEffect(() => {
    if (duration > 0 && duration % triggerSeconds === 0) {
      callback();
    }
  }, [duration])

  return null;
}

IntervalTimer.propTypes = {
  triggerSeconds: PropTypes.number,
  callback: PropTypes.func
};



export default IntervalTimer;

