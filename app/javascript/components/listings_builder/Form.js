import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';
import OtherRoomForm from './OtherRoomForm';
import BedroomInput from '../rooms/BedroomInput';
import Submit from '../inputs/Submit';

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

const generalFeaturesPlaceholder = () => {
  return (
    <div className="flex flex-col items-start mb-px leading-relaxed">
      <p>- e.g. trendy neighbourhood</p>
      <p>- famous for nightlife</p>
      <p>- Great location for exploring the city</p>
    </div>
  )
}

const requestTypesForSteps = {
  1: 'summary_fragment',
  2: 'bedroom_fragment',
  3: 'other_room_fragment'
}

const requestStepCharacterLimit = 800;

const Form = ({
  runsRemaining,
  setRunsRemaining,
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

  const setInputIfValid = (key, value, limit) => {
    if (value.length <= limit) {
      setField(key, value);
    }
  }

  const textInputRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm text-gray-800">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => setInputIfValid(key, e.target.value, 35)}
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const detailField = (title, fieldName, placeholder) => {
    const charsLeft = 200 - inputFields[fieldName].length;
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-start w-full">
          <label className="flex-shrink-0 mt-3 w-1/3 text-sm text-gray-700">{title}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              value={inputFields[fieldName]}
              onChange={(value) => setInputIfValid(fieldName, value, 200)}
              heightClass={"h-32"}
              placeholderContent={placeholder()}
              customClasses={"text-sm"}
            />
          </div>
        </div>
        <div className="self-end pt-2 pr-3 text-xs font-medium text-gray-500">
          {charsLeft <= 30 && <p className={charsLeft <= 10 ? "text-red-500" : ""}>{charsLeft}</p>}
        </div>
      </div>
    )
  }

  const detailPlaceholder = (placeholderText, index) => {
    return (
      <div className="flex flex-col items-start mb-px leading-relaxed">
        <p>{index == 0 ? placeholderText : ""}</p>
      </div>
    )
  }

  const bedroomRow = (title, index, placeholderText) => {
    return (
      <BedroomInput
        key={index}
        bedrooms={inputFields.bedrooms}
        title={title}
        index={index}
        updateIndex={(index, value) => updateBedroomInState(index, value)}
        placeholderContent={detailPlaceholder(placeholderText, index)}
      />
    )
  }

  const bedroomsCountRow = () => {
    return (
      <NumberField
        title="Bedrooms"
        value={inputFields.bedroom_count}
        onChange={(v) => setBedroomCount(v)}
        minValue={1}
        maxValue={8}
      />
    )
  }

  const bedroomFields = () => {
    if (step === 2) {
      const number = inputFields.bedroom_count === "" ? 1 : parseInt(inputFields.bedroom_count);
      const arrayOfIndexes = Array.from(Array(number).keys())
      const bedroomRows = arrayOfIndexes.map((i) => {
        return (
          bedroomRow(`Bedroom ${i + 1}`, i, 'e.g. double bed, ensuite...')
        )
      });

      return (
        <div className="flex flex-col pt-2">
          <div className="mb-6">
            <p className="mt-1 text-sm text-gray-700">
              Add details specific to each bedroom.
            </p>
          </div>
          {bedroomRows}
          {stepButton()}
        </div>
      )
    }
  }

  const roomForm = () => {
    if (step === 3) {
      return (
        <div className="pt-2">
          <OtherRoomForm
            rooms={inputFields.rooms}
            onChange={(rooms) => setField('rooms', rooms)}
          />
          {stepButton()}
        </div>
      )
    }
  }


  const keyFeaturesForm = () => {
    if (step === 1) {
      return (
        <div className="pt-2">
          <p className="mb-6 mt-2">Use our step-by-step tool to build a listing. Text will appear in the results panel as you complete each section. <span className="italic font-medium">This is a new feature - we are still making improvements.</span></p>
          {textInputRow('Property type', 'property_type', 'e.g. apartment, house...', true)}
          {textInputRow('Location', 'location', '', true)}
          {textInputRow('Ideal for', 'ideal_for', 'e.g. families, couples', '', false)}
          {bedroomsCountRow()}
          {detailField('Key Features', 'key_features', generalFeaturesPlaceholder)}
          {stepButton()}
        </div>
      )
    }
  }

  const stepBar = (number, title) => {
    const selectedStyle = "font-bold text-lg"
    const unSelectedStyle = "font-bold text-gray-400 text-lg"
    const isViewedStep = number < highestStep;
    return (
      <div>
        <div onClick={() => isViewedStep && setStep(number)} className={`${isViewedStep ? "cursor-pointer" : ""} pb-4`}>
          <h1 className={step === number ? selectedStyle : unSelectedStyle }>Step {number}: {title}</h1>
        </div>
        <div className="mb-4 w-full h-px bg-gray-200"></div>
      </div>
    )
  }

  const characterLimitForStep = () => {
    const currentStepRequestType = requestTypesForSteps[step];
    return totalCharacterLimitFor[currentStepRequestType];
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
        <form className="flex flex-col items-center w-full text-sm" onSubmit={handleSubmit}>
          <div className="w-4/5">
            <ErrorNotice errors={errors} />
          </div>
          <div className="flex flex-col w-4/5 max-w-2xl pb-4">
            {stepBar(1, "Key features")}
            {withTransition(keyFeaturesForm(), 1)}
            {stepBar(2, "Bedrooms")}
            {withTransition(bedroomFields(), 2)}
            {stepBar(3, "Other rooms & spaces")}
            {withTransition(roomForm(), 3)}
            {resetButton()}
         </div>
       </form>
      </div>
    </div>
  )
}

export default Form;

