import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollOnLoading } from '../hooks';
import FormHeader from './FormHeader';
import ListingFormContainer from './ListingFormContainer';
import RoomFormContainer from '../rooms/FormContainer';
import AreaForm from './AreaForm';
import FullListingForm from '../full_listings/Form';
import FullListingResults from '../full_listings/FullListingResults';
import FullListingPoll from '../full_listings/FullListingPoll';
import Results from '../inputs/Results';
import ResultsPoll from '../inputs/ResultsPoll';

const New = ({ showExample, initialRunsRemaining }) => {
  const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);
  const [formType, setFormType] = useState('listing_description');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);
  const [errors, setErrors] = useState(null);

  const onResult = useScrollOnLoading(loading);

  useEffect(() => {
    if (taskRun) { setTaskRun(null) };
    if (results) { setResults([]) };
  }, [formType]);



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
          loading={loading}
          setLoading={setLoading}
          results={results}
          setResults={setResults}
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

  const resultsSection = () => {
    if (formType === "full_listing") {
      return (
        <>
          <FullListingPoll
            fullListing={results[0]}
            onComplete={(completedListing) => { setResults([completedListing]); setLoading(false) }}
            onError={setErrors}
          />
          <FullListingResults
            runsRemaining={runsRemaining}
            loading={loading}
            results={results}
          />
        </>
      )
    } else {
      return (
        <>
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
        </>
      )
    }
  }

  return (
    <div className="flex flex-col w-full h-full lg:flex-row lg:items-stretch">
      <div className="flex flex-col w-full h-full lg:w-1/2 lg:min-h-screen">
        <FormHeader
          formType={formType}
          setFormType={setFormType}
        />
        {displayForm()}
      </div>
      <div className="w-full border-l-2 lg:w-1/2">
        {resultsSection()}
      </div>
    </div>
  )
}

export default New;
