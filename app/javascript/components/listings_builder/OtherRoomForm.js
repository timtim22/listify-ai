import React from 'react';
import PropTypes from 'prop-types';
import OtherRoomForm from '../rooms/OtherRoomForm';

const RoomForm = ({ inputFields, rooms, onChange, handleSubmit, stepButton }) => {
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

  return (
    <form onSubmit={(e) => handleSubmit(e, otherRoomInputText())} className="pt-4">
      <div className="flex flex-col">
        {header()}
        <OtherRoomForm rooms={rooms} onChange={onChange} />
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
