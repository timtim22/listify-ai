import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import FormHeader from './FormHeader';
import ListingForm from './Form';
import { defaultStepOrder } from '../../helpers/listingBuilder';
import RoomFormContainer from '../rooms/FormContainer';
import AreaForm from './AreaForm';
import ListingBuilderForm from '../listings_builder/Form';
import ListingBuilderResults from '../listings_builder/Results';
import ListingBuilderResultsPoll from '../listings_builder/ResultsPoll';
import FullListingForm from '../full_listings/Form';
import FullListingResults from '../full_listings/FullListingResults';
import FullListingPoll from '../full_listings/FullListingPoll';
import Results from '../inputs/Results';
import ResultsPoll from '../inputs/ResultsPoll';

export const UserContext = createContext();

const New = ({ showExample, initialRunsRemaining, currentUser }) => {
  const [user, setUser] = useState(currentUser);
  const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);
  const [formType, setFormType] = useState('listing_description');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);
  const [errors, setErrors] = useState(null);
  const [builderStepNames, setBuilderStepNames] = useState([defaultStepOrder[0]]);


  useEffect(() => { resetState() }, [formType]);

  const resetState = () => {
    if (taskRun) { setTaskRun(null) }
    if (results) { setResults([]) }
    if (loading) { setLoading(false)}
  }

  const toggleLoading = (newState, isRerun = false) => {
    setLoading(newState);
    if (newState && !isRerun) {
    const element = document.querySelector("#results-container");
    const bufferPx = 65;
    window.scrollTo({ top: element.offsetTop - bufferPx, behavior: 'smooth' });
    }
  }

  const handleNewResults = (newResults) => {
    const newList = taskRun.is_rerun ? [...results, ...newResults] : newResults;
    setResults(newList);
    setLoading(false);
  }

  const handleTaskRun = (response) => {
    setRunsRemaining(response.data.runs_remaining);
    setTaskRun(response.data.task_run);
  }

  const resetFormType = (newType) => {
    resetState();
    setFormType(newType);
  };

  const displayForm = () => {
    const commonProps = {
      runsRemaining: runsRemaining,
      setRunsRemaining: setRunsRemaining,
      loading: loading,
      setLoading: toggleLoading,
      results: results,
      setResults: setResults,
      taskRun: taskRun,
      handleTaskRun: handleTaskRun,
    }

    if (formType === 'neighbourhood') {
      return (
        <AreaForm {...commonProps} shouldGenerateFragment={false} />
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
          setLoading={toggleLoading}
          results={results}
          setResults={setResults}
        />
      )
    } else if (formType === 'listing_builder') {
      return (
        <ListingBuilderForm
          runsRemaining={runsRemaining}
          setRunsRemaining={setRunsRemaining}
          loading={loading}
          setLoading={setLoading}
          results={results}
          onResult={handleTaskRun}
          resetState={() => resetState()}
          taskRun={taskRun}
          stepNames={builderStepNames}
          setStepNames={setBuilderStepNames}
        />
      )
    } else {
      return (
        <ListingForm
          user={user}
          loading={loading}
          setLoading={toggleLoading}
          formType={formType}
          runsRemaining={runsRemaining}
          onResult={handleTaskRun}
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
    } else if (formType === "listing_builder") {
      return (
        <>
          <ListingBuilderResultsPoll
            taskRun={taskRun}
            onResult={(newResults) => { setResults([ ...results, ...newResults ]); setLoading(false); } }
          />
          <ListingBuilderResults
            loading={loading}
            setLoading={(newState) => toggleLoading(newState, true)}
            runsRemaining={runsRemaining}
            results={results}
            taskRun={taskRun}
            onRerun={handleTaskRun}
            stepNames={builderStepNames}
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
            setLoading={(newState) => toggleLoading(newState, true)}
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
    <UserContext.Provider value={user}>
    <div className="flex flex-col w-full h-full lg:flex-row lg:items-stretch">
      <div className="flex flex-col w-full h-full lg:w-1/2 lg:min-h-screen">
        <FormHeader
          user={user}
          formType={formType}
          setFormType={resetFormType}
        />
        {displayForm()}
      </div>
      <div id="results-container" className="w-full border-l-2 lg:w-1/2">
        {resultsSection()}
      </div>
    </div>
    </UserContext.Provider>
  )
}

New.propTypes = {
  currentUser: PropTypes.object,
  initialRunsRemaining: PropTypes.number,
  showExample: PropTypes.string
}

export default New;
