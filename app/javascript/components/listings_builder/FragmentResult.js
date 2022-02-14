import React from 'react';
import PropTypes from 'prop-types';

const FragmentResult = ({
  result,
  formatText,
  shouldShowPreviousButton,
  showPreviousResult,
  refreshButton,
  }) => {

  const cyclePreviousButton = (result) => {
    if (shouldShowPreviousButton) {
      return (
        <button
          type="button"
          title="previous result"
          onClick={() => showPreviousResult(result.request_type)}
          className={`mt-2 flex justify-center items-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 active:bg-gray-200`}>
          <svg width="16" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 15L1 8M1 8L8 1M1 8H19" stroke="#6d28d9" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )
    } else {
      return null;
    }
  };

  const displayText = () => {
    let text = formatText(result);
    if (text === "") {
      text = "Sorry - something went wrong with this request. Tap the refresh button to try again."
    }
    return text;
  };

  return (
    <div key={result.id} className="flex h-full items-stretch pt-4">
      <div className="flex-grow">
        <p className="text-sm whitespace-pre-wrap">{displayText()}</p>
      </div>
      <div className="pl-4 flex flex-col items-start flex-shrink-0">
        {refreshButton}
        {cyclePreviousButton(result)}
      </div>
    </div>
  )
};

FragmentResult.propTypes = {
  result: PropTypes.object,
  formatText: PropTypes.func,
  shouldShowPreviousButton: PropTypes.bool,
  showPreviousResult: PropTypes.func,
  refreshButton: PropTypes.object,
}

export default FragmentResult;
