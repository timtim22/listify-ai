import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import FormHeader from './FormHeader';
import ListingForm from './Form';
import { initialStepArray } from '../../helpers/listingBuilder';
import AboutForm from '../about/Form';
import RoomForm from '../rooms/Form';
import AreaForm from './AreaForm';
import AdvertForm from '../adverts/Form';
import VacasaForm from '../custom_forms/Vacasa';
import OyoForm from '../custom_forms/Oyo';
import ListingBuilderForm from '../listings_builder/Form';
import ListingBuilderResults from '../listings_builder/Results';
import ListingBuilderResultsPoll from '../listings_builder/ResultsPoll';
import FixedOrderMultiStepResults from '../custom_forms/FixedOrderMultiStepResults';
import Results from '../inputs/Results';
import ResultsPoll from '../inputs/ResultsPoll';

export const UserContext = createContext();

const firstScreenFor = (user) => {
  if (user.email.endsWith('@oyorooms.com') || user.email.endsWith('@belvilla.com')) {
    return 'custom_oyo';
  } else if (aboutFirstUser(user)) {
    return 'about';
  } else {
    return 'listing_description';
  }
};

const aboutFirstUser = (user) => {
  const ids = ["197d4687-e3a9-40bb-948b-ec0285c3485e", "d5a62173-ec2b-4cf0-aca5-5bb296eeb710"] //boostly & local test
  return ids.includes(user.id);
};

const New = ({ showExample, initialRunsRemaining, currentUser }) => {
  const [user, setUser] = useState(currentUser);
  const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);
  const [formType, setFormType] = useState(firstScreenFor(currentUser));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [taskRun, setTaskRun] = useState(null);
  const [builderStepNames, setBuilderStepNames] = useState(initialStepArray);

  useEffect(() => { resetState() }, [formType]);

  const resetState = () => {
    if (taskRun) { setTaskRun(null) }
    if (results) { setResults([]) }
    if (loading) { setLoading(false) }
    if (builderStepNames !== initialStepArray) {
      setBuilderStepNames(initialStepArray);
    }
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
    if (formType === 'neighbourhood') {
      return (
        <AreaForm
          loading={loading}
          setLoading={toggleLoading}
          results={results}
          setResults={setResults}
          handleTaskRun={handleTaskRun}
          runsRemaining={runsRemaining}
          shouldGenerateFragment={false}
        />
      );
    } else if (formType === 'room_description') {
      return (
        <RoomForm
          loading={loading}
          setLoading={setLoading}
          formType={formType}
          runsRemaining={runsRemaining}
          onResult={(response) => { setResults([]); handleTaskRun(response) }}
        />
      )
    } else if (formType === 'about') {
      return (
        <AboutForm
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
          onResult={handleTaskRun}
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
          resetState={resetState}
          taskRun={taskRun}
          stepNames={builderStepNames}
          setStepNames={setBuilderStepNames}
        />
      )
    } else if (formType === 'advert') {
      return (
        <AdvertForm
          user={user}
          loading={loading}
          setLoading={toggleLoading}
          runsRemaining={runsRemaining}
          resetState={resetState}
          onResult={(response) => { setResults([]); handleTaskRun(response) }}
          showExample={showExample}
        />
      )
    } else if (formType === 'custom_vacasa') {
      return (
        <VacasaForm
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
          results={results}
          onResult={handleTaskRun}
          stepNames={builderStepNames}
          setStepNames={setBuilderStepNames}
          resetState={resetState}
        />
      )
    } else if (formType === 'custom_oyo') {
      return (
        <OyoForm
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
          results={results}
          onResult={handleTaskRun}
          resetState={resetState}
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
          onResult={(response) => { setResults([]); handleTaskRun(response) }}
          showExample={showExample}
        />
      )
    }
  }

  const resultsSection = () => {
    if (formType === 'listing_builder') {
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
    } else if (['custom_vacasa', 'custom_oyo'].includes(formType)) {
      return (
        <>
          <ListingBuilderResultsPoll
            taskRun={taskRun}
            onResult={(newResults) => { setResults([ ...results, ...newResults ]); setLoading(false); } }
          />
          <FixedOrderMultiStepResults
            loading={loading}
            setLoading={(newState) => toggleLoading(newState, true)}
            runsRemaining={runsRemaining}
            results={results}
            taskRun={taskRun}
            onRerun={handleTaskRun}
            formType={formType}
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
