import React, { useState, useEffect } from 'react';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const emptyRoom = { name: "", description: "" };

const randId = () => {
  return Math.random().toString().substr(2, 8);
}

const RoomForm = ({ rooms, showName, onChange, titlePopoverText }) => {

  const [newRoom, setNewRoom] = useState(emptyRoom);
  const [formOpen, setFormOpen] =  useState(false);
  const [errors, setErrors] = useState(null);

  const addRoom = () => {
    const { name, description } = newRoom;
    if (name.length >= 3 && description.length >= 3) {
      const room = { id: randId(), description, name };
      setFormOpen(false);
      setNewRoom(emptyRoom);
      onChange([ ...rooms, room]);
    } else {
      setErrors("Length is too short");
    }
  }

  const removeRoom = (room) => {
    const newRooms = rooms.filter(r => r.id !== room.id);
    onChange(newRooms);
  }

  const roomList = () => {
    if (rooms.length > 0) {
      return (
        <div className="w-full flex flex-col justify-center mb-8">
         {rooms.map(r => roomListItem(r))}
        </div>
      )
    }
  }

  const roomListHeader = () => {
    return (
      <div className="w-full flex items-center py-2">
        <div className="w-1/3">
          <h3 className=">text-sm font-bold text-gray-700 tracking-wide flex-shrink-0"> Room / space</h3>
        </div>
        <div className="w-2/3">
          <h3 className="text-sm font-bold text-gray-700 tracking-wide flex-shrink-0">Details</h3>
        </div>
      </div>
    )
  }


  const roomListItem = (room) => {
    return (
      <div key={room.id} className="flex items-start w-full mb-2 px-2">
        <div className="w-1/3">
          <p>{room.name}</p>
        </div>
        <div className="w-2/3 flex items-start justify-between">
          <p>{room.description}</p>
          <div className="flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => { removeRoom(room); setNewRoom({ name: room.name, description: room.description }); setFormOpen(true) }}
              className="text-xs text-blue-800 ml-4 focus:outline-none">
              edit
            </button>
            <button
              type="button"
              onClick={() => removeRoom(room)}
              className="text-red-800 text-xs ml-4 focus:outline-none">
              remove
            </button>
          </div>
        </div>
      </div>
    )
  }


  const formFields = () => {
    if (formOpen) {
      return (
        <div className="flex flex-col w-full bg-gray-50 border rounded-lg p-2 border-gray-200">
          {textInputRow("Name of space", newRoom.name, "e.g. open plan kitchen, garden...", false)}
          {detailField("Details", newRoom.description, null)}
          <div className="flex items-center pb-2 pt-4 w-full">
            <div className="w-1/3"></div>
            <div className="pl-3 flex-grow text-red-500">{errors}</div>
            <div className="flex-shrink-0 pr-6">
              <button
                type="button"
                onClick={() => addRoom()}
                className="py-1 px-3 text-xs tracking-wider text-white bg-green-700 rounded-full shadow-sm hover:bg-green-800 focus:outline-none">
                Add
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  const setField = (field, value) => {
    if (errors) { setErrors(null) }
    setNewRoom({ ...newRoom, [field]: value });
  }

  const setInputIfValid = (key, value, limit) => {
    if (value.length < limit) {
      setField(key, value);
    }
  }


  const textInputRow = (title, value, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 px-2 w-full">
        <label className="text-sm font-medium text-gray-700 flex-shrink-0 w-1/3">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => {setInputIfValid("name", e.target.value, 30)}}
          className="w-full form-inline-field text-sm"
        />
      </div>
    )
  }

  const detailField = (title, value, placeholder) => {
    const charLimit = 150;
    return (
      <div className="flex items-start w-full px-2">
        <label className="mt-3 text-sm font-medium text-gray-700 flex-shrink-0 w-1/3">{title}</label>
        <div className="px-3 w-full">
          <div className="bg-white w-full">
            <TextareaWithPlaceholder
              value={value}
              onChange={(value) => setInputIfValid("description", value, charLimit)}
              heightClass={"h-16"}
              placeholderContent={<div className="flex flex-col items-start mb-px leading-relaxed"><p>e.g. microwave, kettle, plenty of natural light</p></div>}
              customClasses={"text-sm"}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="my-4 w-full h-px bg-gray-300"></div>
      <div className="flex items-start">
        <div className="my-4 flex flex-col flex-grow">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Other rooms and spaces</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add details of other rooms and spaces within the property.
          </p>
        </div>
        {!formOpen && <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="mt-4 py-1 px-3 text-xs tracking-wider text-white bg-green-700 rounded-full shadow-sm hover:bg-green-800 focus:outline-none">
          Add
        </button>}
      </div>
      <div className="mb-4 w-full h-px bg-gray-300"></div>
      <div className="my-4">
        {roomList()}
        {formFields()}
      </div>
      {(rooms.length > 0 || formOpen) && <div className="mt-4 mb-8 w-full h-px bg-gray-300"></div>}
    </div>
  )

}

export default RoomForm;
