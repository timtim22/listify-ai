import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';
import BedroomForm from './BedroomForm';
import OtherRoomForm from './OtherRoomForm';

const maxInput = 800;
const newRoomDescription = { bedrooms: [''], rooms: [], request_type: 'room_description' };
const roomTypes = [
  { name: 'bedrooms', value: 'bedrooms' },
  { name: 'other rooms and spaces', value: 'others' }
]

const Form = ({
  formType,
  loading,
  setLoading,
  runsRemaining,
  onResult
  }) => {
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

  const roomTypeSwitch = () => {
    return (
      <div className="flex items-center my-2 w-4/5 max-w-2xl">
        <label className="flex-shrink-0 w-1/3 text-sm">Room type</label>
        <select
          onChange={() => changeInputType()}
          className="mx-3 mt-1 text-sm form-select">
          {roomTypes.map((item) => {
            return (
              <option key={item.value} value={item.value}>{item.name}</option>
            )
          })}
        </select>
      </div>
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
    <div className="flex flex-col items-center w-full">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5 text-sm">
          <ErrorNotice errors={errors} />
        </div>
        {roomTypeSwitch()}
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
    </div>
  )
}
Form.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  results: PropTypes.array,
  onResult: PropTypes.func,
  runsRemaining: PropTypes.number,
  formType: PropTypes.string
}

export default Form;
