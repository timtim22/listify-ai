import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import Notice from './Notice';

const CopyButton = ({ result, copyText }) => {
  const [copied, setCopied] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  useEffect(() => {
    if (copiedNotice) {
      setTimeout(() => setCopiedNotice(false), 2500)
    }
  }, [copiedNotice]);

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
    copyTextToClipboard(copyText);
    setCopiedNotice(true);
  }

  const copyTextToClipboard = (text) => {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const copyIcon = () => {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V18M8 5C8 5.53043 8.21071 6.03914 8.58579 6.41421C8.96086 6.78929 9.46957 7 10 7H12C12.5304 7 13.0391 6.78929 13.4142 6.41421C13.7893 6.03914 14 5.53043 14 5M8 5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H12C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5M14 5H16C16.5304 5 17.0391 5.21071 17.4142 5.58579C17.7893 5.96086 18 6.46957 18 7V10M20 14H10M10 14L13 11M10 14L13 17" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  return (
    <>
      <button
        title="Copy to clipboard"
        onClick={handleClick}
        className="flex justify-center items-center px-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 active:bg-gray-200"
      >
        {copyIcon()}
      </button>
      {copiedNotice && <Notice message="copied to clipboard!" timeoutAfter={2000} />}
    </>
  )
}

CopyButton.propTypes = {
  result: PropTypes.object,
  copyText: PropTypes.string
};

export default CopyButton;
