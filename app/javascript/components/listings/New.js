import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormHeader from './FormHeader';
import ListingFormContainer from './ListingFormContainer';
import AreaForm from './AreaForm';

const New = ({ showExample, initialRunsRemaining }) => {
 const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);
 const [formType, setFormType] = useState('listing_description');

  const displayForm = () => {
    if (formType === 'neighbourhood') {
      return <AreaForm />;
    } else {
      return (
        <ListingFormContainer
          runsRemaining={runsRemaining}
          setRunsRemaining={setRunsRemaining}
          formType={formType}
          showExample={showExample}
        />
      )
    }
  }

  return (
    <div className="w-full h-full">
      <FormHeader
        formType={formType}
        setFormType={setFormType}
      />
      {displayForm()}
    </div>
  )
}

export default New;
