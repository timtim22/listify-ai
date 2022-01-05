import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormHeader from './FormHeader';
import ListingFormContainer from './ListingFormContainer';
import RoomFormContainer from '../rooms/FormContainer';
import AreaForm from './AreaForm';
import FullListingForm from '../full_listings/New';
import Results from '../inputs/Results';
import ResultsPoll from '../inputs/ResultsPoll';

const New = ({ showExample, initialRunsRemaining }) => {
  const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);
  const [formType, setFormType] = useState('listing_description');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);

  const handleNewResults = (newResults) => {
    const newList = taskRun.is_rerun ? [...results, ...newResults] : newResults;
    setResults(newList);
    setLoading(false);
  }

  const handleTaskRun = (response) => {
    setRunsRemaining(response.data.runs_remaining);
    setTaskRun(response.data.task_run);
  }

  const displayForm = () => {
    const commonProps = {
      runsRemaining: runsRemaining,
      setRunsRemaining: setRunsRemaining,
      loading: loading,
      setLoading: setLoading,
      results: results,
      setResults: setResults,
      taskRun: taskRun,
      handleTaskRun: handleTaskRun,
    }

    if (formType === 'neighbourhood') {
      return (
        <AreaForm {...commonProps} />
      );
    } else if (formType === 'room_description') {
      return (
        <RoomFormContainer
          {...commonProps}
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
          {...commonProps}
          formType={formType}
          showExample={showExample}
        />
      )
    }
  }

  return (
    <div className="flex flex-col w-full h-full md:flex-row md:items-stretch">
      <div className="flex flex-col w-full h-full min-h-screen md:w-1/2">
        <FormHeader
          formType={formType}
          setFormType={setFormType}
        />
        {displayForm()}
      </div>
      <div className="w-full border-l-2 md:w-1/2">
        <ResultsPoll
          taskRun={taskRun}
          onResult={handleNewResults}
        />
        <Results
          loading={loading}
          setLoading={(state) => setLoading(state)}
          runsRemaining={runsRemaining}
          results={results}
          taskRun={taskRun}
          onRerun={handleTaskRun}
        />
      </div>
    </div>
  )
}

export default New;
