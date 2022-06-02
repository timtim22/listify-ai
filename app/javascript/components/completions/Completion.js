import React from 'react';
import PropTypes from 'prop-types';

const Completion = ({ completion }) => {
  const displayNormal = (completionText, promptTitle) => {
    return (
      <div>{completionText.trim()}<p>{formattedTitle(promptTitle)}</p></div>
    )
  };

  const displayFiltered = (completionText, promptTitle) => {
    const content = displayNormal(completionText, promptTitle);
    return (
      <div className='text-red-700'>FAILED FILTER: {content}</div>
    )
  };

  const displayCopied = (completionText, promptTitle) => {
    const content = displayNormal(completionText, promptTitle);
    return (
      <div className='text-green-600'>USER COPIED: {content}</div>
    )
  };

  const displayError = (error, promptTitle) => {
    const errorMsg = error.startsWith('<html>') ? error : error;
    const formattedError = <p className='text-red-700'>{errorMsg}</p>
    return (
      <div>{formattedError}{formattedTitle(promptTitle)}</div>
    )
  };

  const formattedTitle = (title) => {
    return (
      <span className='font-medium text-purple-800'>{title}</span>
    )
  };

  if (completion.result_error) {
    return displayError(completion.result_error, completion.prompt_title);
  } else if (completion.failed_filter) {
    return displayFiltered(completion.completion_text, completion.prompt_title)
  } else if (completion.completion_copied) {
    return displayCopied(completion.completion_text, completion.prompt_title);
  } else {
    return displayNormal(completion.completion_text, completion.prompt_title);
  }
};

Completion.propTypes = {
  completion: PropTypes.object
}

export default Completion;
