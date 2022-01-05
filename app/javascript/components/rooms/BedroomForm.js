import React, { useState, useEffect } from 'react';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';
import BedroomInput from './BedroomInput';

const BedroomForm = ({ roomDescription, setRoomDescription }) => {
  const [bedroomCount, setBedroomCount] = useState(1);

  const updateBedroomInState = (index, newValue) => {
    const { bedrooms } = roomDescription;
    let newBedrooms = [ ...bedrooms ];
    newBedrooms[index] = newValue;
    setRoomDescription({ ...roomDescription, bedrooms: newBedrooms });
  }

  const changeBedroomCount = (newCount) => {
    if (newCount < roomDescription.bedrooms.length) {
      setRoomDescription({
        ...roomDescription,
        bedrooms: roomDescription.bedrooms.slice(0, newCount)
      });
      setBedroomCount(newCount);
    } else {
      setRoomDescription({
        ...roomDescription,
        bedrooms: [ ...roomDescription.bedrooms, '' ]
      });
      setBedroomCount(newCount);
    }
  }

  const bedroomCountAsArray = () => {
    const number = bedroomCount === "" ? 1 : parseInt(bedroomCount);
    return Array.from(Array(number).keys());
  }

  const bedroomFields = () => {
    return (
      <div className="flex flex-col">
        {bedroomCountAsArray().map((i) => {
          return (
            bedroomRow(`Bedroom ${i + 1}`, i, 'e.g. double bed, ensuite...')
          )
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
        maxValue={4}
      />
    )
  }

  const detailPlaceholder = (placeholderText) => {
    return (
      <div className="flex flex-col items-start mb-px text-sm leading-relaxed">
        <p>{placeholderText}</p>
      </div>
    )
  }

  const bedroomRow = (title, index, placeholderText) => {
    return (
      <BedroomInput
        key={index}
        bedrooms={roomDescription.bedrooms}
        title={title}
        index={index}
        updateIndex={(index, value) => updateBedroomInState(index, value)}
        placeholderContent={detailPlaceholder(placeholderText)}
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

export default BedroomForm;
