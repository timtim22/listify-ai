import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { createRequest } from '../../helpers/requests';
import { randId } from '../../helpers/utils';
import { defaultStepOrder, displayNameFor, userCharactersFor } from '../../helpers/listingBuilder';
import ErrorNotice from '../common/ErrorNotice';
import OtherRoomForm from './OtherRoomForm';
import KeyFeaturesForm from './KeyFeaturesForm';
import BedroomForm from './BedroomForm';
import Submit from '../inputs/Submit';
import AreaForm from '../listings/AreaForm';

const newInputFields = {
  property_type: '',
  location: '',
  ideal_for: '',
  bedroom_count: 1,
  key_features: '',
  bedrooms: [{ id: 1, details: '' }],
  rooms: [],
}

const requestStepCharacterLimit = 800;

const Form = ({
  runsRemaining,
  loading,
  setLoading,
  results,
  onResult,
  stepNames,
  setStepNames,
  resetState
}) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [errors, setErrors] = useState(null);
  const [step, setStep] = useState(1);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const setBedroomCount = (newCount) => {
    if (newCount < inputFields.bedrooms.length) {
      setInputFields({
        ...inputFields,
        bedrooms: inputFields.bedrooms.slice(0, newCount),
        bedroom_count: newCount
      });
    } else {
      setInputFields({
        ...inputFields,
        bedrooms: newBedrooms(newCount),
        bedroom_count: newCount
      });
    }
  }

  const newBedrooms = (newCount) => {
    let newBedrooms = [ ...inputFields.bedrooms ]
    const toAdd = newCount - inputFields.bedrooms.length;
    for (let i = 0; i < toAdd; i++) { newBedrooms.push({ id: randId(), details: '' }) }
    return newBedrooms;
  };

  const updateBedroomInState = (newRoom) => {
    let newRooms = [...inputFields.bedrooms];
    const index = newRooms.findIndex(e => e.id === newRoom.id);
    newRooms[index] = newRoom;
    setField('bedrooms', newRooms);
  }

  const selectNextStep = (nextStepName) => {
    if (!stepNames.includes(nextStepName)) {
      setStepNames([ ...stepNames, nextStepName ]);
    }
  }

  const resetForm = () => {
    setInputFields(newInputFields);
    resetState();
    setStep(1);
    setStepNames([defaultStepOrder[0]]);
  }

  const setNextStep = () => {
    if (stepNames.length === 4) {
      setStep(5);
    } else {
      setStep(step + 1);
    }
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    onResult(response);
    setNextStep();
  }

   const handleSubmit = (e, inputText) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/listing_fragments.json",
      {
        listing_fragment: {
          input_text: inputText,
          request_type: stepNames[step - 1]
        },
      },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const keyFeaturesForm = () => {
    return (
      <KeyFeaturesForm
        inputFields={inputFields}
        setBedroomCount={setBedroomCount}
        setField={setField}
        handleSubmit={handleSubmit}
        stepButton={stepButton}
      />
    )
  }

  const bedroomForm = () => {
    return (
      <BedroomForm
        inputFields={inputFields}
        updateBedroomInState={updateBedroomInState}
        handleSubmit={handleSubmit}
        stepButton={stepButton}
      />
    )
  }

  const otherRoomForm = () => {
    return (
      <OtherRoomForm
        inputFields={inputFields}
        rooms={inputFields.rooms}
        onChange={(rooms) => setField('rooms', rooms)}
        handleSubmit={handleSubmit}
        stepButton={stepButton}
      />
    )
  }

  const areaForm = () => {
    return (
      <div className="pt-4">
        <AreaForm
          handleTaskRun={onResult}
          loading={loading}
          setLoading={setLoading}
          results={results}
          setResults={() => {}}
          runsRemaining={runsRemaining}
          shouldGenerateFragment={true}
          onFragmentResponse={handleRequestSuccess}
        />
      </div>
    )
  };

  const stepBar = (number, name) => {
    const selectedStyle = "font-bold text-lg"
    const unSelectedStyle = "font-bold text-gray-400 text-lg"
    return (
      <div>
        <div onClick={() => setStep(number)} className="cursor-pointer pb-4">
          <h1 className={step === number ? selectedStyle : unSelectedStyle }>
            Step {number}: {displayNameFor(name)}
          </h1>
        </div>
        <div className="mb-4 w-full h-px bg-gray-200"></div>
      </div>
    )
  }

  const stepButton = () => {
    const buttonText = step === 4 ? 'Finish' : 'Next';
    const activeStep = stepNames[step-1];
    const userCharacters = userCharactersFor(activeStep, inputFields);
    return (
      <>
        <div className="flex justify-center py-8 w-full">
          <Submit
            inputText={userCharacters}
            userInputLength={userCharacters.length}
            maxUserInput={requestStepCharacterLimit}
            loading={loading}
            runsRemaining={runsRemaining}
            buttonText={buttonText}
          />

        </div>
      </>
    )
  }

  const formFor = (stepName) => {
    const forms = {
      summary_fragment: keyFeaturesForm(),
      bedroom_fragment: bedroomForm(),
      other_room_fragment: otherRoomForm(),
      area_description_fragment: areaForm()
    }
    return forms[stepName];
  }

  const stepBars = () => {
    return defaultStepOrder.map((name, index) => {
      if (name === "summary_fragment") {
        return (
          <div key={name}>
            {stepBar(index + 1, stepNames[index])}
            {step === index + 1 && formFor(stepNames[index])}
          </div>
        )

      } else {
        return (
          <div key={name}>
            <Transition
              show={index < stepNames.length}
              enter="transition ease-linear transform duration-500"
              enterFrom="scale-25 opacity-0"
              enterTo="scale-100 opacity-100"
            >
              {stepBar(index + 1, stepNames[index])}
              {step === index + 1 && formFor(stepNames[index])}
            </Transition>
          </div>
        )
      }
    });
  }

  const nextStepButtons = () => {
    const buttonSteps = defaultStepOrder.filter(s => !stepNames.includes(s));
    return buttonSteps.map((buttonName) => {
      return (
        <button
          key={buttonName}
          onClick={() => selectNextStep(buttonName)}
          className="primary-button mx-2">
          {displayNameFor(buttonName)}
        </button>
      )
    });
  }

  const nextStepBar = () => {
    return (
      <Transition
        show={step > stepNames.length}
        enter="transition ease-linear transform duration-500"
        enterFrom="scale-25 opacity-0"
        enterTo="scale-100 opacity-100"
      >
        {step <= 4 && <div className="mb-8 mt-4">
          <p className="text-gray-600 font-medium text-center">Now add:</p>
          <div className="mb-4 flex mt-8 justify-center">
            {nextStepButtons()}
          </div>
        </div>}
      </Transition>
    )
  }

  const resetBar = () => {
    if (stepNames.length >= 2) {
      const cursorStyle = loading ? "cursor-not-allowed" : "cursor-pointer";
      const notCompletedStep = [stepNames.length, stepNames.length + 1].includes(step);
      return (
        <div className="w-full flex flex-col justify-center mb-4">
          {(notCompletedStep && step !== 5) && <div className="mb-4 w-full h-px bg-gray-200"></div>}
          <button
            disabled={loading}
            type="button"
            onClick={resetForm}
            className={`text-xs secondary-link ${cursorStyle} mt-4`}
          >
            Clear all sections and start again
          </button>
        </div>
      )
    }
  }

  return (
    <div className="overflow-hidden w-full">
      <div className="flex flex-col items-center pt-2 w-full h-full">
        <div className="flex flex-col items-center w-full text-sm" >
          <div className="w-4/5">
            <ErrorNotice errors={errors} />
          </div>
          <div className="flex flex-col w-4/5 max-w-2xl pb-4">
            {stepBars()}
            {nextStepBar()}
            {resetBar()}
         </div>
       </div>
      </div>
    </div>
  )
}

Form.propTypes = {
  runsRemaining: PropTypes.number,
  setRunsRemaining: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  results: PropTypes.array,
  onResult: PropTypes.func,
  resetState: PropTypes.func,
  stepNames: PropTypes.array,
  setStepNames: PropTypes.func,
  handleTaskRun: PropTypes.func
}

export default Form;
