import React from 'react';
import PropTypes from 'prop-types';
import { bedroomTextForBackend } from '../../helpers/utils';
import BedroomInput from '../rooms/BedroomInput';

const BedroomForm = ({ inputFields, updateBedroomInState, handleSubmit, stepButton }) => {

  const bedroomInputText = () => {
    return bedroomTextForBackend(inputFields.bedrooms);
  }

  const bedroomRow = (title, bedroom) => {
    return (
      <BedroomInput
        key={bedroom.id}
        bedroom={bedroom}
        title={title}
        updateIndex={(value) => updateBedroomInState(value)}
        placeholderContent={detailPlaceholder(title === 'Bedroom 1')}
      />
    )
  }

  const detailPlaceholder = (showPlaceholder) => {
    return (
      <div className="flex flex-col items-start mb-px leading-relaxed">
        <p className="mt-1 ml-px">{showPlaceholder ? 'e.g. wardrobe, ensuite...' : ""}</p>
      </div>
    )
  }

  const bedroomRows = inputFields.bedrooms.map((bedroom, i) => {
    return bedroomRow(`Bedroom ${i + 1}`, bedroom)
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
