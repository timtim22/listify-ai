import React, { useState } from 'react';
import PropTypes from 'prop-types';

const catch500 = 'Oops! Something went wrong on our side. We\'re sorry about this, and we hopefully have been alerted, but please let us know you\'re seeing this.'

const ErrorNotice = ({ errors }) => {
  const [unexpectedError, setUnexpectedError] = useState(false);

  const parseErrors = () => {
    let errorMessages = [];
    if (typeof(errors) === 'string') {
      errorMessages.push(catch500);
      if (!unexpectedError) {
        setUnexpectedError(true);
      }
    } else if (errors.message) {
      errorMessages.push(errors.message);
    } else {
      Object.keys(errors).forEach((key) => {
        errors[key].map(error => errorMessages.push(`${key}: ${error}`))
      })
    }
    return errorMessages;
  }

  const renderError = (msg) => {
    return (
      <li
        key={msg}
        className="list-disc list-inside">
        {msg}
      </li>
    )
  }

  if (errors) {
    const errorMessages = parseErrors();

    return (
      <div className="p-4 mb-4 text-red-800 bg-red-100 rounded border border-red-200">
        {!unexpectedError && <h2>Please correct the following errors:</h2>}
        <ul className="py-2">
          {errorMessages.map(msg => renderError(msg))}
        </ul>
      </div>
    )
  } else {
    return null;
  }

}

ErrorNotice.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default ErrorNotice;

