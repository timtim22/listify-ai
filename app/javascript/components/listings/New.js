import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormHeader from './FormHeader';
import ListingFormContainer from './ListingFormContainer';
import RoomFormContainer from './RoomFormContainer';
import AreaForm from './AreaForm';
import FullListingForm from '../full_listings/New';

const New = ({ showExample, initialRunsRemaining }) => {
 const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);
 const [formType, setFormType] = useState('listing_description');

  const displayForm = () => {
    if (formType === 'neighbourhood') {
      return (
        <AreaForm
          runsRemaining={runsRemaining}
          setRunsRemaining={setRunsRemaining}
        />
      );
    } else if (formType === 'room_description') {
      return (
        <RoomFormContainer
          runsRemaining={runsRemaining}
          setRunsRemaining={setRunsRemaining}
          formType={formType}
          showExample={showExample}
        />
      )
    } else if (formType === 'full_listing') {
      return (
        <FullListingForm
          runsRemaining={runsRemaining}
          setRunsRemaining={setRunsRemaining}
        />
      )
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
