import React from 'react';
import PropTypes from 'prop-types';

const colors = {
  gray: {
    base: "text-gray-800 bg-gray-200",
    button: "text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:bg-gray-500 focus:text-white"
  },
  green: {
    base: "text-green-800 bg-green-100",
    button: "text-green-400 hover:bg-green-200 hover:text-green-500 focus:bg-green-500 focus:text-white"
  },
  purple: {
    base: "text-purple-800 bg-purple-100",
    button: "text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:bg-purple-500 focus:text-white"
  },
  yellow: {
    base: "text-yellow-800 bg-yellow-100",
    button: "text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500 focus:bg-yellow-500 focus:text-white"
  },
}

const stylesForColor = (color, styles) => {
  if (colors[color]) { return colors[color][styles] }
  return (colors.gray[styles]);
};

const ButtonPillWithClose = ({ name, onClick, baseColor = "gray" }) => {
  return (
    <span className={`inline-flex items-center rounded-full py-0.5 pl-2 pr-0.5 text-xs font-medium ${stylesForColor(baseColor, 'base')}`}>
      {name}
      <button type="button" className={`ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${stylesForColor(baseColor, 'button')} focus:outline-none`}>
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
  baseColor: PropTypes.string,
  onClick: PropTypes.func,
}

export default ButtonPillWithClose;
