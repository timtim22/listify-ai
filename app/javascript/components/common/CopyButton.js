import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';

const CopyButton = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const registerClick = (result_id) => {
    setCopied(true);
    createRequest(
      `/copy_events.json`,
      { result_id },
      (response) => {},
      (e) => { console.log(e) }
    )
  }

  const handleClick = () => {
    if (!copied) {
      registerClick(result.id);
    }
    copyTextToClipboard(result.result_text)
  }

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
      onClick={handleClick}
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
