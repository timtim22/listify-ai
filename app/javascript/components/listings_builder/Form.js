import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { createRequest } from '../../helpers/requests';
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
  sleeps: 2,
  key_features: '',
  bedrooms: [''],
  rooms: [],
}

const requestTypesForSteps = {
  1: 'summary_fragment',
  2: 'bedroom_fragment',
  3: 'other_room_fragment',
  4: 'area_description_fragment'
}

const requestStepCharacterLimit = 800;

const Form = ({
  runsRemaining,
  loading,
  setLoading,
  results,
  onResult,
  resetState
}) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [errors, setErrors] = useState(null);
  const [step, setStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  const [leaveTransition, setLeaveTransition] = useState(false);

  useEffect(() => {
    if (step > highestStep) { setHighestStep(step) }
  }, [step]);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const changeStep = (nextStep) => {
    setLeaveTransition(true);
    setTimeout(() => {
      setStep(nextStep);
      setLeaveTransition(false);
    }, 200);
  }

  const resetForm = () => {
    setInputFields(newInputFields);
    resetState();
    setStep(1);
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
        bedrooms: [ ...inputFields.bedrooms, '' ],
        bedroom_count: newCount
      });
    }
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    changeStep(step + 1);
    onResult(response);
  }

  const assembleHeadline = () => {
    const { bedroom_count, property_type, location, ideal_for, key_features } = inputFields;
    const first = `- ${bedroom_count} bedroom ${property_type} in ${location}\n`;
    const second = ideal_for.length > 3 ? `- ideal for ${ideal_for}\n` : "";
    return `${first}${second}${key_features}`
  }

  const bedroomInputText = () => {
    const { bedrooms } = inputFields;
    return bedrooms.map((b, i) => b.length >= 3 ? `bedroom ${i + 1}: ${b}` : "").join("\n");
  }

  const otherRoomInputText = () => {
    const { rooms } = inputFields;
    return rooms.map(r => r.name.length >= 3 ? `${r.name}: ${r.description}` : "").join("\n");
  }

  const summaryUserCharacters = () => {
    const { property_type, location, key_features, ideal_for } = inputFields;
    return `${property_type} ${location} ${key_features} ${ideal_for}`;
  }

  const bedroomsUserCharacters = () => {
    return inputFields.bedrooms.join(" ");
  }

  const otherRoomsUserCharacters = () => {
    return inputFields.rooms.map(r => `${r.name} ${r.description}`).join(" ");
  }

  const userCharacters = () => {
    switch(requestTypesForSteps[step]) {
      case 'summary_fragment':
        return summaryUserCharacters();
        break;
      case 'bedroom_fragment':
        return bedroomsUserCharacters();
        break;
      case 'other_room_fragment':
        return otherRoomsUserCharacters();
        break;
      default:
        return null;
    }
  }


  const inputTextForStep = () => {
    switch(requestTypesForSteps[step]) {
      case 'summary_fragment':
        return assembleHeadline();
        break;
      case 'bedroom_fragment':
        return bedroomInputText();
        break;
      case 'other_room_fragment':
        return otherRoomInputText();
        break;
      default:
        return "unmatched fragment type";
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setLoading(true);
      createRequest(
        "/listing_fragments.json",
        {
          listing_fragment: {
            input_text: inputTextForStep(),
            request_type: requestTypesForSteps[step]
          },
        },
        (response) => { handleRequestSuccess(response) },
        (e) => { setErrors(e); setLoading(false) }
      )
    }, 100);
  }

  const updateBedroomInState = (index, newValue) => {
    const { bedrooms } = inputFields;
    let newBedrooms = [ ...bedrooms ];
    newBedrooms[index] = newValue;
    setField('bedrooms', newBedrooms);
  }

  const keyFeaturesForm = () => {
    if (step === 1) {
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
  }

  const bedroomForm = () => {
    if (step === 2) {
      return (
        <BedroomForm
          inputFields={inputFields}
          updateBedroomInState={updateBedroomInState}
          handleSubmit={handleSubmit}
          stepButton={stepButton}
        />
      )
    }
  }

  const roomForm = () => {
    if (step === 3) {
      return (
        <form onSubmit={handleSubmit} className="pt-2">
          <OtherRoomForm
            rooms={inputFields.rooms}
            onChange={(rooms) => setField('rooms', rooms)}
          />
          {stepButton()}
        </form>
      )
    }
  }

  const areaForm = () => {
    return (
      <AreaForm
        handleTaskRun={onResult}
        loading={loading}
        setLoading={setLoading}
        results={results}
        setResults={() => {}}
        runsRemaining={runsRemaining}
        shouldGenerateFragment={true}
      />
    )
  };

  const stepBar = (number, title) => {
    const selectedStyle = "font-bold text-lg"
    const unSelectedStyle = "font-bold text-gray-400 text-lg"
    //const isViewedStep = number < highestStep;
    const isViewedStep = true
    return (
      <div>
        <div onClick={() => isViewedStep && setStep(number)} className={`${isViewedStep ? "cursor-pointer" : ""} pb-4`}>
          <h1 className={step === number ? selectedStyle : unSelectedStyle }>Step {number}: {title}</h1>
        </div>
        <div className="mb-4 w-full h-px bg-gray-200"></div>
      </div>
    )
  }

  const stepButton = () => {
    const buttonText = step === 3 ? 'Finish' : 'Next';
    return (
      <>
        <div className="flex justify-center py-8 w-full">
          <Submit
            inputText={userCharacters()}
            userInputLength={userCharacters().length}
            maxUserInput={requestStepCharacterLimit}
            loading={loading}
            runsRemaining={runsRemaining}
            buttonText={buttonText}
          />

        </div>
        {step !== 3 && <div className="mb-4 w-full h-px bg-gray-200"></div>}
      </>
    )
  }

  const resetButton = () => {
    if (step === 4) {
      return (
        <div className="flex justify-center py-8 w-full">
          <button
            disabled={loading}
            className={`${loading ? "cursor-not-allowed opacity-50" : ""} primary-button`}
            type="button"
            onClick={resetForm}
          >
            Start again
          </button>
        </div>
      )
    }
  }


  const withTransition = (children, contentStep) => {
    return (
    <Transition
      show={step === contentStep && !leaveTransition}
      enter="transition ease-linear transform duration-200"
      enterFrom="scale-25 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition ease-linear transform duration-500"
      leaveFrom="translate-y-full opacity-100"
      leaveTo="translate-y-0 opacity-0"
    >
     {children}
    </Transition>
    )
  }

  return (
    <div className="overflow-hidden w-full">
      <div className="flex flex-col items-center pt-2 w-full h-full">
        <div className="flex flex-col items-center w-full text-sm" >
          <div className="w-4/5">
            <ErrorNotice errors={errors} />
          </div>
          <div className="flex flex-col w-4/5 max-w-2xl pb-4">
            {stepBar(1, "Key features")}
            {withTransition(keyFeaturesForm(), 1)}
            {stepBar(2, "Bedrooms")}
            {withTransition(bedroomForm(), 2)}
            {stepBar(3, "Other rooms & spaces")}
            {withTransition(roomForm(), 3)}
            {stepBar(4, "Area")}
            {withTransition(areaForm(), 4)}
            {resetButton()}
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
  handleTaskRun: PropTypes.func
}

export default Form;
