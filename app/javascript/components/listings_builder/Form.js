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
  key_features: '',
  bedrooms: [''],
  rooms: [],
}

const requestStepCharacterLimit = 800;

const firstStep = "summary_fragment";

const Form = ({
  runsRemaining,
  loading,
  setLoading,
  results,
  onResult,
  resetState,
  taskRun
}) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [errors, setErrors] = useState(null);
  const [step, setStep] = useState(1);
  const [stepNames, setStepNames] = useState([firstStep]);
  const [leaveTransition, setLeaveTransition] = useState(false);

  useEffect(() => { // needed as area form calls a different submit function
    if (taskRun) { changeStep(step + 1) }
  }, [taskRun]);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const changeStep = (nextStep) => {
    setLeaveTransition(true);
    //setTimeout(() => {
      setStep(nextStep);
      setLeaveTransition(false);
    //}, 500);
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
    setStepNames([firstStep]);
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
    onResult(response);
    //changeStep(step + 1);
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
    switch(stepNames[step-1]) {
      case 'summary_fragment':
        return summaryUserCharacters();
        break;
      case 'bedroom_fragment':
        return bedroomsUserCharacters();
        break;
      case 'other_room_fragment':
        return otherRoomsUserCharacters();
        break;
      case 'area_description_fragment':
        return ''; // validated separately
        break;
      default:
        return null;
    }
  }


  const inputTextForStep = () => {
    switch(stepNames[step-1]) {
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
    setLoading(true);
    createRequest(
      "/listing_fragments.json",
      {
        listing_fragment: {
          input_text: inputTextForStep(),
          request_type: stepNames[step - 1]
        },
      },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const updateBedroomInState = (index, newValue) => {
    const { bedrooms } = inputFields;
    let newBedrooms = [ ...bedrooms ];
    newBedrooms[index] = newValue;
    setField('bedrooms', newBedrooms);
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
      <form onSubmit={handleSubmit} className="pt-4">
        <OtherRoomForm
          rooms={inputFields.rooms}
          onChange={(rooms) => setField('rooms', rooms)}
        />
        {stepButton()}
      </form>
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
        />
      </div>
    )
  };

  const stepBar = (number, name) => {
    const selectedStyle = "font-bold text-lg"
    const unSelectedStyle = "font-bold text-gray-400 text-lg"
    const isViewedStep = true
    return (
      <div>
        <div onClick={() => isViewedStep && setStep(number)} className={`${isViewedStep ? "cursor-pointer" : ""} pb-4`}>
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
      </>
    )
  }

  const resetButton = () => {
    if (step === 5) {
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
    //<Transition
      //show={step === contentStep && !leaveTransition}
      //enter="transition ease-linear transform duration-200"
      //enterFrom="scale-25 opacity-0"
      //enterTo="scale-100 opacity-100"
      //leave="transition ease-linear transform duration-500"
      //leaveFrom="translate-y-full opacity-100"
      //leaveTo="translate-y-0 opacity-0"
    //>
       children
    //</Transition>
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

  const displayNameFor = (stepName) => {
    const names = {
      summary_fragment: 'Key Features',
      bedroom_fragment: 'Bedrooms',
      other_room_fragment: 'Other Rooms',
      area_description_fragment: 'Area'
    }
    return names[stepName];
  }


  const contentFor = (index, stepName) => {
    if (step === index) {
      const form = formFor(stepName);
      return withTransition(form, index);
    }
  };

  const stepBars = () => {
    return stepNames.map((name, index) => {
      return (
        <div key={name}>
          {stepBar(index + 1, name)}
          {contentFor(index + 1, name)}
        </div>
      )
    });
  }

  const nextStepButtons = () => {
    const defaultStepOrder = ['summary_fragment', 'bedroom_fragment', 'other_room_fragment', 'area_description_fragment']
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
    if (step > stepNames.length) {
      return (
        <Transition
          show={true}
          enter="transition ease-linear transform duration-200"
          enterFrom="scale-25 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition ease-linear transform duration-500"
          leaveFrom="translate-y-full opacity-100"
          leaveTo="translate-y-0 opacity-0"
        >
 
          <div className="my-4">
            <p className="text-center">Now add:</p>
            <div className="mb-4 flex mt-8 border-red-500 justify-center">
              {nextStepButtons()}
            </div>
          </div>
        </Transition>
      )
    }
  }

  const resetBar = () => {
    if (step > 2) {
      return (
        <div className="w-full flex justify-center mb-4">
          <button
            disabled={loading}
            type="button"
            onClick={resetForm}
            className={`text-xs secondary-link ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            Or start again
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
  taskRun: PropTypes.object,
  handleTaskRun: PropTypes.func
}

export default Form;
