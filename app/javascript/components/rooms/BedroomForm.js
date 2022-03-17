import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { randId } from '../../helpers/utils';
import NumberField from '../common/NumberField';
import BedroomInput from './BedroomInput';

const BedroomForm = ({ bedrooms, setBedrooms }) => {
  const [bedroomCount, setBedroomCount] = useState(1);

  const updateBedroomInState = (newRoom) => {
    let newRooms = [...bedrooms];
    const index = newRooms.findIndex(e => e.id === newRoom.id);
    newRooms[index] = newRoom;
    setBedrooms(newRooms);
  }

  const changeBedroomCount = (newCount) => {
    if (newCount < bedrooms.length) {
      setBedrooms(bedrooms.slice(0, newCount));
      setBedroomCount(newCount);
    } else {
      let newBedrooms = [ ...bedrooms ]
      const toAdd = newCount - bedrooms.length;
      for (let i = 0; i < toAdd; i++) { newBedrooms.push({ id: randId(), details: '' }) }
      setBedrooms(newBedrooms);
      setBedroomCount(newCount);
    }
  }

  const bedroomFields = () => {
    return (
      <div className="flex flex-col">
        {bedrooms.map((bedroom, i) => {
          return bedroomRow(`Bedroom ${i + 1}`, bedroom)
        })}
      </div>
    )
  }

  const bedroomCountRow = () => {
    return (
      <NumberField
        title="Number of bedrooms"
        value={bedroomCount}
        onChange={(v) => changeBedroomCount(v)}
        minValue={1}
        maxValue={8}
      />
    )
  }

  const detailPlaceholder = (placeholderText) => {
    return (
      <div className="flex flex-col items-start mb-px text-sm leading-relaxed">
        <p className="mt-1 ml-px">
          {placeholderText}
        </p>
      </div>
    )
  }

  const bedroomRow = (title, bedroom) => {
    const placeholder = title === 'Bedroom 1' ? 'e.g. large room, wardrobe, ensuite' : '';
    return (
      <BedroomInput
        key={bedroom.id}
        bedroom={bedroom}
        bed={bedroom.bed}
        title={title}
        updateIndex={(value) => updateBedroomInState(value)}
        placeholderContent={detailPlaceholder(placeholder)}
      />
    )
  }

  return (
    <>
      {bedroomCountRow()}
      {bedroomFields()}
    </>
  )
}

BedroomForm.propTypes = {
  bedrooms: PropTypes.array,
  setBedrooms: PropTypes.func,
};

export default BedroomForm;
