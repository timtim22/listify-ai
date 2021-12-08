import React, { useState, useEffect } from 'react';
import { useScrollToTopOnError } from '../hooks';
import { createRequest } from '../../helpers/requests';
import { cleanObjectInputText, coerceWithinRange } from '../../helpers/utils';
import ErrorNotice from '../common/ErrorNotice';
import LanguageSelect from '../common/LanguageSelect';
import Submit from '../inputs/Submit';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import Switch from '../common/Switch';
import OtherRoomForm from '../full_listings/RoomForm';

const maxRooms = 4;

const newRoomDescription = { bedrooms: [''], rooms: [] };

const Form = ({ showExample, formType, loading, setLoading, runsRemaining, onResult }) => {
  const [roomDescription, setRoomDescription] = useState({ ...newRoomDescription, request_type: formType });
  const [bedroomCount, setBedroomCount] = useState(1);
  const [errors, setErrors] = useState(null);
  const [inputType, setInputType] = useState('bedrooms');
  const [userInputLength, setUserInputLength] = useState(0);

  const onError = useScrollToTopOnError(errors);

  useEffect(() => {
    if (roomDescription.request_type !== formType) {
      setField('request_type', formType)
    }
  }, [formType])

  const handleRequestSuccess = (response) => {
    setErrors(null);
    onResult(response);
  }

  const changeInputType = () => {
    const newType = inputType === 'bedrooms' ? 'others' : 'bedrooms';
    setErrors(null);
    setInputType(newType);
  }



  const bedroomInputText = () => {
    return roomDescription.bedrooms.map((b, i) => `bedroom ${i + 1}: ${b}`).join("\n");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/room_descriptions.json",
      { room_description: { request_type: roomDescription.request_type, input_text: bedroomInputText() } },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const updateBedroomInState = (index, newValue) => {
    const { bedrooms } = roomDescription;
    let newBedrooms = [ ...bedrooms ];
    newBedrooms[index] = newValue;
    setField('bedrooms', newBedrooms);
  }

  const setField = (field, value) => {
    setRoomDescription({ ...roomDescription, [field]: value });
  }

  const changeBedroomCount = (newCount) => {
    if (newCount < roomDescription.bedrooms.length) {
      setRoomDescription({
        ...roomDescription,
        bedrooms: roomDescription.bedrooms.slice(0, newCount)
      });
      setBedroomCount(newCount);
    } else {
      setRoomDescription({
        ...roomDescription,
        bedrooms: [ ...roomDescription.bedrooms, '' ]
      });
      setBedroomCount(newCount);
    }
  }

  const bedroomCountRow = () => {
    return (
      <div className="flex justify-start items-center mb-4 w-full">
        <label className="w-1/3 font-medium text-sm text-gray-700">Bedrooms to describe</label>
        <div className="flex flex-col w-2/3 md:flex-row md:items-center">
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              max="4"
              placeholder="1"
              required={true}
              value={bedroomCount}
              onChange={(e) => {changeBedroomCount(coerceWithinRange(e.target.value, 1, 8))}}
              className="w-16 text-sm form-inline-field"
            />
          </div>
        </div>
      </div>
    )
  }

  const bedroomRow = (title, index, placeholderText, required) => {
    const bedroom = roomDescription.bedrooms[index];
    const charsLimit = 150;
    const charsLeft = charsLimit - (bedroom && bedroom.length || 0);
    return (
      <div key={index} className="flex flex-col w-full">
        <div className={`${charsLeft <= 30 ? "" : "mb-4"} flex justify-start items-start mt-4 w-full`}>
          <label className="flex-shrink-0 mt-3 w-1/3 text-sm font-medium text-gray-700">{title}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              value={bedroom || ""}
              onChange={(value) => {charsLimit - value.length >= 0 && updateBedroomInState(index, value)}}
              heightClass={"h-16"}
              placeholderContent={<div className="flex flex-col items-start mb-px leading-relaxed"><p>{index == 0 ? placeholderText : ""}</p></div>}
              customClasses={"text-sm"}
            />
          </div>
        </div>
        <div className="self-end pt-1 pr-3 text-xs font-medium text-gray-500">
          {charsLeft <= 30 && <p className={charsLeft <= 10 ? "text-red-500" : ""}>{charsLeft}</p>}
        </div>
      </div>
    )
  }

  const bedroomFields = () => {
    const number = bedroomCount === "" ? 1 : parseInt(bedroomCount);
    const arrayOfIndexes = Array.from(Array(number).keys())
    const bedroomRows = arrayOfIndexes.map((i) => {
      return (
        bedroomRow(`Bedroom ${i + 1}`, i, 'e.g. double bed, ensuite...', false)
      )
    });

    return (
      <div className="flex flex-col mb-4">
        {bedroomRows}
      </div>
    )
  }

  const inputModeSwitch = () => {
    return (
      <Switch
        handleToggle={changeInputType}
        isOn={inputType === 'others'}
        leftLabel='bedrooms'
        rightLabel='others'
      />
    )
  }

  const bedroomForm = () => {
    return (
      <>
        {bedroomCountRow()}
        {bedroomFields()}
      </>
    )
  }

  const otherRoomForm = () => {
    return (
      <OtherRoomForm
        rooms={roomDescription.rooms}
        showName={true}
        onChange={(rooms) => setField('rooms', rooms)}
        sectionTitle={"Other rooms and spaces"}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col items-center w-full">
        {inputModeSwitch()}
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      </div>
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {inputType === 'bedrooms' ? bedroomForm() : otherRoomForm()}
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={roomDescription.input_text}
              userInputLength={roomDescription.bedrooms.join("").length}
              maxUserInput={250}
              loading={loading}
              runsRemaining={runsRemaining}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default Form;
