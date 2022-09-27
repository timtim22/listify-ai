import React from 'react';
import PropTypes from 'prop-types';

const ButtonPillWithClose = ({ name, onClick, textColor = "text-gray-800" }) => {
  return (
    <span className={`inline-flex items-center rounded-full bg-gray-200 py-0.5 pl-2 pr-0.5 text-xs font-medium ${textColor}`}>
      {name}
      <button type="button" className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:bg-gray-500 focus:text-white focus:outline-none">
        <span className="sr-only">Remove option</span>
        <svg onClick={onClick} className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  )
};


ButtonPillWithClose.propTypes = {
  name: PropTypes.string,
  textColor: PropTypes.string,
  onClick: PropTypes.func,
}

export default ButtonPillWithClose;
