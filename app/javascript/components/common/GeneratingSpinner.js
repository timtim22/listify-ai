import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IntervalTimer from './IntervalTimer';

const messages = [
  "Alright! Lets see what we can do. This may take a few seconds...",
  "Generating some great results for you...",
  "Almost there...",
  "Just a moment more...",
  "Sorry, this is taking longer than usual. We're working on it...",
  "This is much slower than we'd like. Please let us know, we'll look into it."
]

const GeneratingSpinner = ({ color }) => {
  const [spinnerTextIndex, setSpinnerTextIndex] = useState(0);

  const spinnerColor = color || "border-blue-600";
  const messageIndex = Math.min(spinnerTextIndex, messages.length - 1);

  return (
   <div className="flex flex-col items-center">
     <div className="flex justify-center items-center py-2 w-9 h-9">
       <div className={`${spinnerColor} animate-spin rounded-full h-6 w-6 border-t-2 border-b-2`}></div>
      </div>
      <p className="mt-4 text-sm text-center">{messages[messageIndex]}</p>
      <IntervalTimer
        triggerSeconds={7}
        callback={() => setSpinnerTextIndex(spinnerTextIndex + 1)}
      />
    </div>
  )
}

GeneratingSpinner.propTypes = {
  color: PropTypes.string
};


export default GeneratingSpinner;
