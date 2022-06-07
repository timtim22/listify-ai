import React, { useState } from 'react';
import PropTypes from 'prop-types';

const networkError = 'Error connecting to the server - please check your internet connection, or contact us if this keeps happening.'
const serverError  = 'Oops! Something went wrong on our side. We\'re sorry about this, and we hopefully have been alerted, but please let us know you\'re seeing this.'
const unknownError = 'An unknown error occurred. Sorry about that - please let us know you are seeing this message.'

const ErrorNotice = ({ errors }) => {
  const [internalError, setInternalError] = useState(false);

  const parseErrors = () => {
    let errorMessages = [];
    if (errors === 'Network Error') {
      errorMessages = [networkError];
    } else if (errors.status && errors.status >= 400) {
      errorMessages = [serverError];
      if (!internalError) { setInternalError(true) }
    } else if (errors.message) {
      errorMessages = [errors.message];
    } else if (errors.data) {
      Object.keys(errors.data).forEach((key) => {
        errors.data[key].map(error => errorMessages.push(`${key}: ${error}`))
      })
    } else {
      errorMessages = [unknownError];
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
        {!internalError && <h2>Please correct the following errors:</h2>}
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

