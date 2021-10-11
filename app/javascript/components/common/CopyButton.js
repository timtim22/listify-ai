import React from 'react';
import PropTypes from 'prop-types';

const CopyButton = ({ result }) => {
  console.log(result)

  const copyTextToClipboard = (text) => {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  return (
    <button
      title="copy"
      onClick={() => copyTextToClipboard(result.result_text)}
      className="flex justify-center items-center py-0.5 px-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg border border-gray-100"
    >
      <span className="text-xs font-medium tracking-wide">COPY</span>
    </button>
  )
}

CopyButton.propTypes = {
  result: PropTypes.object
};

export default CopyButton;
