import React, { useState } from 'react';

const ErrorNotice = ({ errors }) => {

  const parseErrors = () => {
    let errorMessages = [];
    Object.keys(errors).forEach((key) => {
      errors[key].map(error => errorMessages.push(`${key}: ${error}`))
    })
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
        <h2>Please correct the following errors:</h2>
        <ul className="py-2">
          {errorMessages.map(msg => renderError(msg))}
        </ul>
      </div>
    )
  } else {
    return null;
  }

}

export default ErrorNotice;

