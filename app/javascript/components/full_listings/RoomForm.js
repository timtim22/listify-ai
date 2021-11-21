import React, { useState, useEffect } from 'react';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const RoomForm = ({ rooms, showName, onChange, sectionTitle, titlePopoverText }) => {

  useEffect(() => {
    if (rooms.length === 0) {
      addRoom();
    }
  }, [])

  const addRoom = () => {
    const room = {id: rooms.length + 1, description: "", name: ""};
    onChange([ ...rooms, room]);
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

  const rowStyle = "inline-block mt-1 rounded-md border-gray-300 shadow-sm placeholder-gray-400 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"

  const nameField = (room) => {
    if (showName) {
      return (
        <div className="mb-2 w-full md:mb-0 md:w-1/3 pr-2 py-2">
          <input
            value={room.name}
            placeholder={"Kitchen, sitting room..."}
            type="text"
            className={`${rowStyle} flex-grow w-full`}
            onChange={(e) => updateRoom({id: room.id, description: room.description, name: e.target.value})}
          />
        </div>
      )
    }
  }


  const roomRow = (room) => {
    return (
      <div key={room.id} className="flex flex-col mb-2 md:flex-row md:items-start">
        {nameField(room)}
        <div className={`${showName ? "w-full md:w-2/3 flex items-center pl-2" : "w-full flex items-center"}`}>
          <div className="my-2 w-full">
            <TextareaWithPlaceholder
              value={room.description}
              onChange={(value) => updateRoom({id: room.id, description: value, name: room.name})}
              heightClass={"h-16"}
              placeholderContent={<div className="flex flex-col items-start mb-px"><p>details</p></div>}
            />
          </div>
          <button
            type="button"
            onClick={() => removeRoom(room)}
            className="ml-2 text-red-500">
            X
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col my-4">
      <div className="flex justify-start mb-2 text-ss-blue">
        <h4 className="md:mr-1">{sectionTitle || "Rooms"}</h4>
        <button
          type="button"
          onClick={() => addRoom()}
          className="ml-4 underline focus:outline-none">
          + Add more
        </button>
      </div>
      {rooms && rooms.map(l => roomRow(l))}
    </div>
  )

}

export default RoomForm;
