import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import { createRequest } from '../../helpers/requests';
import { cleanObjectInputText } from '../../helpers/utils';
import ErrorNotice from '../common/ErrorNotice';
import LanguageSelect from '../common/LanguageSelect';
import Submit from '../inputs/Submit';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const placeholderFor = (room) => {
  const placeholders = {
    bedroom: ["e.g. comfortable and modern", "double bed", "dressing table with mirror", "doors open out onto small private balcony" ],
    bathroom: ["e.g. sleek", "Italian design", "marble tiles", "large sink", "power shower", "full length mirror"],
    kitchen: ["e.g. sleek", "Italian design", "modern appliances", "American style fridge-freezer", "breakfast bar"],
    living_room: ["e.g. cosy", "plenty of light", "large sofa", "leather arm chair", "huge TV with Netflix"]
  }
  return placeholders[room.replace(" ", "_")] || placeholders["bedroom"];
}

const maxInput = 250;
const newRoomDescription = { input_text: '', room: 'bedroom' };

const Form = ({ showExample, formType, loading, setLoading, runsRemaining, onResult }) => {
  const [roomDescription, setRoomDescription] = useState({ ...newRoomDescription, request_type: formType });
  const [outputLanguage, setOutputLanguage] = useState('EN');
  const [errors, setErrors] = useState(null);
  const [userInputLength, setUserInputLength] = useState(0);

  const onError = useScrollToTopOnError(errors);

  useEffect(() => {
    if (roomDescription.request_type !== formType) {
      setField('request_type', formType)
    }
  }, [formType])

  const setField = (field, value) => {
    setRoomDescription({ ...roomDescription, [field]: value });
  }

  const setInputText = (value, trueUserInputLength) => {
    setUserInputLength(trueUserInputLength);
    setField('input_text', value);
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    onResult(response);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/room_descriptions.json",
      { room_description: cleanObjectInputText(roomDescription), output_language: outputLanguage },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const selectRoom = () => {
    return (
      <div className="flex justify-start items-center my-2 w-full">
        <label className="flex-shrink-0 w-1/3">Room</label>
        <select
          onChange={(e) => setField("room", e.target.value)}
          className="mx-3 mt-1 form-select">
          {["bedroom", "bathroom", "kitchen", "living room"].map((item) => {
            return (
              <option key={item} value={item}>{item}</option>
            )
          })}
        </select>
      </div>
    )
  }

  const keyFeatures = () => {
    return (
      <div className="flex items-start w-full">
        <label className="flex-shrink-0 mt-2 w-1/3">Key features</label>
        <div className="px-3 w-full">
          <TextareaWithPlaceholder
            value={roomDescription.input_text}
            onChange={(value) => setInputText(value, value.length)}
            placeholderContent={
            <div className="flex flex-col items-start mb-px">
              {placeholderFor(roomDescription.room).map(point => <p key={point}>- {point}</p>)}
            </div>
          } />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="mb-px w-full h-8"></div>
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      </div>
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          <div className="flex flex-col justify-start w-full">
            {selectRoom()}
            {keyFeatures()}
          </div>
          <LanguageSelect onSelect={setOutputLanguage} label={"Output language"} />
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={roomDescription.input_text}
              userInputLength={userInputLength}
              maxUserInput={maxInput}
              loading={loading}
              runsRemaining={runsRemaining}
            />
          </div>
        </div>
        <div className="flex justify-center items-center py-2 px-2 w-full text-center align-middle bg-gray-200">
          <p className="text-sm font-medium text-gray-900">Please note: this language model is still being trained. Some outputs may be highly creative!</p>
        </div>
      </form>
    </>
  )
}

export default Form;
