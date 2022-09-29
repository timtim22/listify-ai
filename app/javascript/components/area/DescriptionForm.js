import React from 'react';
import PropTypes from 'prop-types';
import ButtonPillWithClose from '../common/ButtonPillWithClose';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';

const DescriptionForm = ({ loading, formState, setFormState, selectedResults, toggleSelected, inputFields, setField, submitForm }) => {

  const attractionRow = () => {
    return (
      <div className="flex justify-start items-center my-2 w-full min-h-12">
        <label className="flex-shrink-0 w-1/3 text-sm">Selected attractions</label>
        {selectedAttractionList()}
      </div>
    )
  };

  const selectedAttractionList = () => {
    const categories = Object.keys(selectedResults);
    if (formState === 'base_form') {
      return (
        <span
          onClick={() => setFormState('search_form')}
          className="cursor-pointer italic text-xs mx-4 secondary-link">
          Tap here to open search.
        </span>
      )
    } else if (categories.every(k => selectedResults[k].length === 0)) {
      return (
        <span
          className="italic text-xs mx-4">
          Nothing selected yet.
        </span>
      )
    } else {
      return (
        <div className="flex flex-wrap pl-2">
          {categories.map((category) => {
            return selectedResults[category].map(place => attractionPill(place, category))
          })}
        </div>
      )
    }
  };

  const attractionPill = (place, placeType) => {
    return (
      <div key={place.place_id} className="mt-1 mx-1">
        <ButtonPillWithClose
          name={place.name}
          onClick={() => toggleSelected(place.place_id, placeType)}
        />
      </div>
    )
  };



  const textRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center my-2 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => {setField(key, e.target.value)}}
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const detailsField = () => {
    return (
      <div className="flex items-start w-full mt-2 text-sm">
        <label className="flex-shrink-0 mt-2 w-1/3">Additional details or keywords</label>
        <div className="px-3 w-full">
          <TextareaWithPlaceholder
            value={inputFields.detail_text}
            onChange={(value) => setField('detail_text', value)}
            customClasses={"text-sm"}
            heightClass={"h-16"}
            placeholderContent={
            <>
              <p>- e.g. trendy neighbourhood</p>
              <p>- Great location for exploring the city</p>
            </>
          } />
        </div>
      </div>
    )
  }

  const submitButton = () => {
    const disabled = loading || tooFewAttractionsSelected();
      return (
      <button disabled={disabled} className={`primary-button ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
        Generate
      </button>
    )
  }

  const tooFewAttractionsSelected = () => {
    const keys = Object.keys(selectedResults);
    const count = keys.reduce((acc, k) => acc + selectedResults[k].length, 0)
    return count < 2;
  };

  return (
    <form className="flex flex-col items-center w-full" onSubmit={submitForm}>
      <div className="flex flex-col w-4/5 max-w-2xl">
        <p className="mb-4 text-sm">Fill in details for the area you wish to write about. You can search and select attractions from multiple areas.</p>
        {textRow('Name of area','user_provided_area_name','e.g. Waterloo, London', true)}
        {attractionRow()}
        {detailsField()}
        <div className="flex justify-center pt-8 pb-4 w-full">
          {submitButton()}
        </div>
        <div className="my-4 w-full h-px bg-gray-200"></div>
      </div>
    </form>
  )
};

DescriptionForm.propTypes = {
  loading: PropTypes.bool,
  formState: PropTypes.string,
  setFormState: PropTypes.func,
  inputFields: PropTypes.object,
  setField: PropTypes.func,
  selectedResults: PropTypes.object,
  submitForm: PropTypes.func,
  toggleSelected: PropTypes.func
}

export default DescriptionForm;
