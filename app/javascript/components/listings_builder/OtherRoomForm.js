import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import { randId } from '../../helpers/utils';

const maxRooms = 6;
const maxNameLength = 40;
const maxDetailLength = 150;
const charSoftWarningLength = 30;
const charHardWarningLength = 10;

const RoomForm = ({ inputFields, rooms, onChange, handleSubmit, stepButton }) => {

  useEffect(() => {
    if (rooms.length === 0) { addRoom() }
  }, [])

  const addRoom = () => {
    if (rooms.length < maxRooms) {
      const room = { id: randId(), description: "", name: "" };
      onChange([ ...rooms, room]);
    }
  }

  const updateRoom = (room) => {
    let newRooms = [...rooms];
    const editIndex = newRooms.findIndex(e => e.id === room.id);
    newRooms[editIndex] = room;
    onChange(newRooms);
  }

  const removeRoom = (room) => {
    const newRooms = rooms.filter(r => r.id !== room.id);
    onChange(newRooms);
  }

  const updateIfLengthAllowed = (room, key, value, charLimit) => {
    value.length <= charLimit && updateRoom({ ...room, [key]: value });
  }

  const otherRoomInputText = () => {
    const { rooms } = inputFields;
    return rooms.map(r => r.name.length >= 3 ? `${r.name}: ${r.description}` : "").join("\n");
  }

  const header = () => {
    return (
      <>
        <div className="flex items-start mb-6">
          <p className="mt-1 text-sm text-gray-700">
            Add details of other rooms and spaces within the property.
          </p>
        </div>
      </>
    )
  }

  const roomList = () => {
    if (rooms.length > 0) {
      return (
        <div className="flex flex-col justify-center w-full">
         {rooms.map(r => roomRow(r))}
        </div>
      )
    }
  }

  const roomRow = (room) => {
    return (
      <div key={room.id} className="flex flex-col items-start">
        {textInputRow("Name of space", room, "e.g. open plan kitchen")}
        {detailField("Details", room, null)}
        <div className="flex justify-end items-center px-3 w-full">
          <button
            type="button"
            onClick={() => removeRoom(room)}
            className="ml-2 text-xs text-red-700">
            remove
          </button>
        </div>
      <div className="my-4 w-full h-px bg-gray-200"></div>
     </div>
    )
  }

  const textInputRow = (title, room, placeholder, required = false) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm text-gray-700">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={room.name}
          onChange={(e) => updateIfLengthAllowed(room, 'name', e.target.value, maxNameLength)}
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const detailPlaceholder = () => {
    return (
      <div className="flex flex-col items-start mb-px text-sm leading-relaxed">
        <p>e.g. microwave, kettle, plenty of natural light</p>
      </div>
    )
  }

  const detailField = (title, room, placeholder) => {
    const charsLeft = maxDetailLength - room.description.length;
    return (
      <div className="flex flex-col justify-start w-full">
        <div className={`${charsLeft <= charSoftWarningLength ? "" : "mb-4"} flex justify-start w-full`}>
          <div className="flex items-start w-full">
            <label className="flex-shrink-0 mt-3 w-1/3 text-sm text-gray-700">Details</label>
            <div className="w-2/3 bg-white">
              <div className="px-3 w-full">
                <TextareaWithPlaceholder
                  value={room.description}
                  onChange={(value) => updateIfLengthAllowed(room, 'description', value, maxDetailLength)}
                  heightClass={"h-16"}
                  placeholderContent={detailPlaceholder()}
                  customClasses={"text-sm"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="self-end pt-2 pr-5 text-xs text-gray-500">
          {characterCounter(charsLeft)}
        </div>
      </div>
    )
  }

  const characterCounter = (charsLeft) => {
    if (charsLeft <= charSoftWarningLength) {
      return (
        <p className={charsLeft <= charHardWarningLength ? "text-red-500" : ""}>
          {charsLeft}
        </p>
      )
    }
  }

  const addRoomButton = () => {
    if (rooms.length < maxRooms) {
      return (
        <button
          type="button"
          onClick={addRoom}
          className="self-center text-xs text-gray-700 underline focus:outline-none">
          Add a room
        </button>
      )
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, otherRoomInputText())} className="pt-4">
      <div className="flex flex-col">
        {header()}
        <div>
          {roomList()}
          {addRoomButton()}
        </div>
      </div>
      {stepButton()}
    </form>
  )
}

RoomForm.propTypes = {
  inputFields: PropTypes.object,
  rooms: PropTypes.array,
  onChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  stepButton: PropTypes.func
}

export default RoomForm;
