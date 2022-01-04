import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollOnResult } from '../hooks';
import Form from './Form';

const ListingFormContainer = ({
  showExample,
  runsRemaining,
  loading,
  setLoading,
  results,
  handleTaskRun,
  formType
}) => {
  const onResult = useScrollOnResult(results);

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

export default ListingFormContainer;
