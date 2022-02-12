import React from 'react';
import PropTypes from 'prop-types';
import BedroomInput from '../rooms/BedroomInput';

const BedroomForm = ({ inputFields, updateBedroomInState, handleSubmit, stepButton }) => {

  const bedroomInputText = () => {
    const { bedrooms } = inputFields;
    return bedrooms.map((b, i) => b.length >= 3 ? `bedroom ${i + 1}: ${b}` : "").join("\n");
  }

  const bedroomRow = (title, index, placeholderText) => {
    return (
      <BedroomInput
        key={index}
        bedrooms={inputFields.bedrooms}
        title={title}
        index={index}
        updateIndex={(index, value) => updateBedroomInState(index, value)}
        placeholderContent={detailPlaceholder(placeholderText, index)}
      />
    )
  }

  const detailPlaceholder = (placeholderText, index) => {
    return (
      <div className="flex flex-col items-start mb-px leading-relaxed">
        <p>{index == 0 ? placeholderText : ""}</p>
      </div>
    )
  }

  const number = inputFields.bedroom_count === "" ? 1 : parseInt(inputFields.bedroom_count);
  const arrayOfIndexes = Array.from(Array(number).keys())
  const bedroomRows = arrayOfIndexes.map((i) => {
    return (
      bedroomRow(`Bedroom ${i + 1}`, i, 'e.g. double bed, ensuite...')
    )
  });

  return (
    <form onSubmit={(e) => handleSubmit(e, bedroomInputText())} className="flex flex-col pt-4">
      <div className="mb-6">
        <p className="mt-1 text-sm text-gray-700">
          Add details specific to each bedroom.
        </p>
      </div>
      {bedroomRows}
      {stepButton()}
    </form>
  )

};

BedroomForm.propTypes = {
  inputFields: PropTypes.object,
  updateBedroomInState: PropTypes.func,
  handleSubmit: PropTypes.func,
  stepButton: PropTypes.func
}

export default BedroomForm;
