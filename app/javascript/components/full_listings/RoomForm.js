import React, { useState, useEffect } from 'react';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const maxRooms = 4;

const randId = () => {
  return Math.random().toString().substr(2, 8);
}

const RoomForm = ({ rooms, showName, onChange, titlePopoverText }) => {

  const [errors, setErrors] = useState(null);

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

  const roomList = () => {
    if (rooms.length > 0) {
      return (
        <div className="flex flex-col justify-center w-full">
         {rooms.map(r => roomRow(r))}
        </div>
      )
    }
  }

  const roomListHeader = () => {
    if (rooms.length > 0) {
      return (
        <div className="flex items-center pb-4 w-full">
          <div className="w-1/3">
            <h3 className="flex-shrink-0 font-bold tracking-wide text-gray-900 >text-sm"> Room / space</h3>
          </div>
          <div className="px-3 w-2/3">
            <h3 className="flex-shrink-0 text-sm font-bold tracking-wide text-gray-900">Details</h3>
          </div>
        </div>
      )
    }
  }

  const rowStyle = "inline-block mt-1 rounded-md border-gray-300 shadow-sm placeholder-gray-400 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"

  const textInputRow = (title, room, placeholder, required) => {
    const charLimit = 40;
    return (
      <div className="flex justify-start items-center pr-4 w-full">
        <div className="w-full bg-white">
          <TextareaWithPlaceholder
            value={room.name}
            onChange={(value) => value.length <= charLimit && updateRoom({ ...room, name: value })}
            heightClass={"h-16"}
            placeholderContent={<div className="flex flex-col items-start mb-px leading-relaxed"><p>e.g. open plan kitchen / diner</p></div>}
            customClasses={"text-sm"}
          />
        </div>
      </div>
    )
  }

  const detailField = (title, room, placeholder) => {
    const charLimit = 150;
    const charsLeft = charLimit - room.description.length;
    return (
      <div className={`${charsLeft <= 30 ? "" : "mb-4"} flex flex-col justify-start w-full`}>
        <div className="flex items-start w-full">
          <div className="px-3 w-full">
            <div className="w-full bg-white">
              <TextareaWithPlaceholder
                value={room.description}
                onChange={(value) => value.length <= charLimit && updateRoom({ ...room, description: value })}
                heightClass={"h-16"}
                placeholderContent={<div className="flex flex-col items-start mb-px leading-relaxed"><p>e.g. microwave, kettle, plenty of natural light</p></div>}
                customClasses={"text-sm"}
              />
            </div>
          </div>
        </div>
        <div className="self-end pt-2 pr-5 text-xs font-medium text-gray-500">
          {charsLeft <= 30 && <p className={charsLeft <= 10 ? "text-red-500" : ""}>{charsLeft}</p>}
        </div>
      </div>
    )
  }


  const roomRow = (room) => {
    return (
      <div key={room.id} className="flex items-start mb-4">
        <div className="w-1/3">
          {textInputRow("Name of space", room, "e.g. open plan kitchen, garden...", false)}
        </div>
        <div className="flex items-start w-2/3">
          {detailField("Details", room, null)}
          <div className="flex items-center h-16">
            <button
              type="button"
              onClick={() => removeRoom(room)}
              className="ml-2 text-xs font-medium text-red-700">
              remove
            </button>
          </div>
        </div>
     </div>
    )
  }


  return (
    <div className="flex flex-col">
      <div className="mb-4 w-full h-px bg-gray-200"></div>
      <div className="flex items-start">
        <div className="flex flex-col flex-grow mt-8 mb-4">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Other rooms and spaces</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add details of other rooms and spaces within the property.
          </p>
        </div>
     </div>
      <div className="mb-4 w-full h-px bg-gray-200"></div>
      <div className="my-4">
        {roomListHeader()}
        {roomList()}
        {rooms.length < maxRooms && <button
          type="button"
          onClick={addRoom}
          className="self-center mb-4 text-xs font-medium text-gray-700 underline focus:outline-none">
          Add a room
        </button>}
      </div>
      <div className="mb-8 w-full h-px bg-gray-200"></div>
    </div>
  )
}

export default RoomForm;
