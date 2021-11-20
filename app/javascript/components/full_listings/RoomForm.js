import React, { useState, useEffect } from 'react';

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

  const nameField = (room) => {
    if (showName) {
      return (
        <div className="mb-2 w-full md:mr-6 md:mb-0 md:w-1/2">
          <input
          value={room.name}
          placeholder={"Name"}
          type="text"
          className="form-inline-field"
          onChange={(e) => updateRoom({id: room.id, description: room.description, name: e.target.value})} />
        </div>
      )
    }
  }

  const roomRow = (room) => {
    return (
      <div key={room.id} className="flex flex-col mb-2 md:flex-row md:items-center">
        {nameField(room)}
        <div className={`${showName ? "w-full md:w-1/2 flex items-center md:ml-6" : "w-full flex items-center"}`}>
          <input
            value={room.description}
            placeholder={"details"}
            type="text"
            className="form-inline-field"
            onChange={(e) => updateRoom({id: room.id, description: e.target.value, name: room.name})} />
          <button
            type="button"
            onClick={() => removeRoom(room)}
            className="px-1 mx-4 text-red-500">
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col mb-6">
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

