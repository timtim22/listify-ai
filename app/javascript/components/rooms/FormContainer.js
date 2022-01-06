import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';

const RoomFormContainer = ({
  showExample,
  runsRemaining,
  loading,
  setLoading,
  results,
  handleTaskRun,
  formType
}) => {

  return (
    <Form
      loading={loading}
      setLoading={(state) => setLoading(state)}
      formType={formType}
      runsRemaining={runsRemaining}
      onResult={handleTaskRun}
      showExample={showExample}
    />
  )
}

export default RoomFormContainer;
