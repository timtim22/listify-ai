import React, { useState, useEffect } from 'react';
import { useScrollToTopOnError } from '../hooks';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';
import Switch from '../common/Switch';
import BedroomForm from './BedroomForm';
import OtherRoomForm from './OtherRoomForm';

const maxInput = 250;
const newRoomDescription = { bedrooms: [''], rooms: [], request_type: 'room_description' };

const Form = ({ showExample, formType, loading, setLoading, runsRemaining, onResult }) => {
  const [roomDescription, setRoomDescription] = useState({ ...newRoomDescription, request_type: formType });
  const [errors, setErrors] = useState(null);
  const [inputType, setInputType] = useState('bedrooms');

  const onError = useScrollToTopOnError(errors);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    createRequest(
      "/room_descriptions.json",
      {
        room_description: {
        request_type: roomDescription.request_type,
        input_text: swapBulletsForCommas(currentViewInputText())
        }
      },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const swapBulletsForCommas = (string) => {
    return string.replaceAll("\n- ", ",").replaceAll(": -", ":");
  }

  const currentViewInputText = () => {
    if (inputType === 'bedrooms') {
      return bedroomInputText();
    } else {
      return otherRoomInputText();
    }
  }

  const bedroomInputText = () => {
    const { bedrooms } = roomDescription;
    return bedrooms.map((b, i) => b.length >= 3 ? `bedroom ${i + 1}: ${b}` : "").join("\n");
  }

  const otherRoomInputText = () => {
    const { rooms } = roomDescription;
    return rooms.map(r => r.name.length >= 3 ? `${r.name}: ${r.description}` : "").join("\n");
  }

  const setField = (field, value) => {
    setRoomDescription({ ...roomDescription, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    onResult(response);
  }

  const changeInputType = () => {
    const newType = inputType === 'bedrooms' ? 'others' : 'bedrooms';
    setErrors(null);
    setRoomDescription(newRoomDescription);
    setInputType(newType);
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

  const formFields = () => {
    if (inputType === 'bedrooms') {
      return (
        <BedroomForm
          roomDescription={roomDescription}
          setRoomDescription={setRoomDescription}
        />
      )
    } else {
      return (
        <OtherRoomForm
          rooms={roomDescription.rooms}
          onChange={(rooms) => setField('rooms', rooms)}
        />
      )
    }
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
          {formFields()}
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={currentViewInputText()}
              userInputLength={currentViewInputText().length}
              maxUserInput={maxInput}
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