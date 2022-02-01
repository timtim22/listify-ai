import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';
import OtherRoomForm from '../rooms/OtherRoomForm';
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

const maxInputs = 2000

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

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
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
    setStep(step + 1);
    onResult(response);
  }

  const assembleHeadline = () => {
    const { bedroom_count, property_type, location, ideal_for, key_features } = inputFields;
    const first = `- ${bedroom_count} bedroom ${property_type} in ${location}\n`;
    const second = ideal_for.length > 3 ? `- ideal for ${ideal_for}\n` : "";
    return `${first}${second}${key_features}`
  }

  const consolidateInput = () => {
    const { property_type, location, key_features, bedrooms, rooms } = inputFields;
    const roomDescs = rooms.map(r => (r.name + r.description)).join("");
    return property_type + location + key_features + bedrooms.join("") + roomDescs;
  }

  const bedroomInputText = () => {
    const { bedrooms } = inputFields;
    return bedrooms.map((b, i) => b.length >= 3 ? `bedroom ${i + 1}: ${b}` : "").join("\n");
  }

  const otherRoomInputText = () => {
    const { rooms } = inputFields;
    return rooms.map(r => r.name.length >= 3 ? `${r.name}: ${r.description}` : "").join("\n");
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
        <div className="flex flex-col my-4">
          <div className="mt-8 mb-4">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Bedrooms</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add details specific to each bedroom.
            </p>
          </div>
          <div className="mb-4 w-full h-px bg-gray-200"></div>
          {bedroomRows}
          {stepButton()}
        </div>
      )
    }
  }

  const roomForm = () => {
    if (step === 3) {
      return (
        <>
          <OtherRoomForm
            rooms={inputFields.rooms}
            onChange={(rooms) => setField('rooms', rooms)}
            showHeader={true}
          />
          {stepButton()}
        </>
      )
    }
  }


  const keyFeaturesForm = () => {
    if (step === 1) {
      return (
        <>
          {textInputRow('Property type', 'property_type', 'e.g. apartment, house...', true)}
          {textInputRow('Location', 'location', '', true)}
          {textInputRow('Ideal for', 'ideal_for', 'e.g. families, couples', '', false)}
          {bedroomsCountRow()}
          {detailField('Key Features', 'key_features', generalFeaturesPlaceholder)}
          {stepButton()}
        </>
      )
    }
  }

  const submitButton = () => {
    return (
      <Submit
        inputText={consolidatedInput}
        userInputLength={consolidatedInput.length}
        maxUserInput={maxInputs}
        loading={loading}
        runsRemaining={runsRemaining}
      />
    )
  }

  const stepBar = (number, title) => {
    const selectedStyle = "font-bold text-lg mb-4"
    const unSelectedStyle = "font-bold text-gray-400 text-lg mb-4"
    return (
      <div onClick={() => setStep(number)} className="cursor-pointer">
        <h1 className={step === number ? selectedStyle : unSelectedStyle }>Step {number}: {title}</h1>
        <div className="mb-4 w-full h-px bg-gray-200"></div>
      </div>
    )
  }

  const stepButton = () => {
    const buttonText = step === 3 ? 'Finish' : 'Next';
    return (
      <div className="flex justify-center py-8 w-full">
        <button className="primary-button" type="submit">{buttonText}</button>
      </div>
    )
  }

  const resetButton = () => {
    if (step === 4) {
      return (
        <div className="flex justify-center py-8 w-full">
          <button
            className="primary-button"
            type="button"
            onClick={resetForm}
          >
            Start again
          </button>
        </div>
      )
    }
  }

  const consolidatedInput = consolidateInput();

  return (
    <div className="overflow-hidden w-full">
      <div className="flex flex-col items-center pt-2 w-full h-full">
        <form className="flex flex-col items-center w-full text-sm" onSubmit={handleSubmit}>
          <div className="w-4/5">
            <ErrorNotice errors={errors} />
          </div>
          <div className="flex flex-col w-4/5 max-w-2xl">
            {stepBar(1, "Key features")}
            {keyFeaturesForm()}
            {stepBar(2, "Bedrooms")}
            {bedroomFields()}
            {stepBar(3, "Other rooms")}
            {roomForm()}
            {resetButton()}
         </div>
       </form>
      </div>
    </div>
  )
}

export default Form;

