import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ButtonPillWithClose from '../common/ButtonPillWithClose';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import Submit from '../inputs/Submit';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';

const pillColors = { attractions: 'purple', stations: 'gray', restaurants: 'yellow' };
const maxInput = 250;

const DescriptionForm = ({
  currentSearchResult,
  formState,
  handleSearchResult,
  inputFields,
  loading,
  runsRemaining,
  selectedResults,
  setErrors,
  setField,
  setFormState,
  setLoading,
  submitForm,
  toggleSelected
}) => {

  const [searchOpen, setSearchOpen] = useState(false);

  const attractionRow = () => {
    return (
      <div className="flex justify-start items-center my-4 w-full min-h-12">
        <label className="flex-shrink-0 w-1/3 text-sm">Selected attractions</label>
        <div className="w-full flex flex-col">
          {selectedAttractionList()}
          {searchLink()}
        </div>
      </div>
    )
  };

  const searchLink = () => {
    if (!searchOpen) {
      const nextState = currentSearchResult.search_location_id ? 'result_form' : 'search_form';
      return (
        <span
          onClick={() => { setFormState(nextState); setSearchOpen(true) }}
          className="cursor-pointer italic text-xs mx-4 secondary-link font-semibold">
          Tap here to open search.
        </span>
      )
    }
  };

  const selectedAttractionList = () => {
    const categories = Object.keys(selectedResults);
    if (categories.some(k => selectedResults[k].length > 0)) {
      return (
        <div className="flex flex-wrap pl-2 mb-4">
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
          baseColor={pillColors[placeType]}
          onClick={() => toggleSelected(place.place_id, placeType)}
        />
      </div>
    )
  };

  const onEnterPress = (e) => {
    if (e.key !== 'Enter') { return }
    e.preventDefault();
    if (!searchOpen && !currentSearchResult.search_location_id) {
      setFormState('search_form');
      setSearchOpen(true);
    }
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
          onKeyPress={(e) => onEnterPress(e)}
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
    const disabled = loading || !minimumAttractionsSelected();
    const { user_provided_area_name, detail_text } = inputFields;

    if (disabled) {
      return (
        <div className="flex justify-center pt-8 pb-4 w-full">
          <button disabled={disabled} className={disabled ? "disabled-primary-button" : "primary-button"}>
            Generate
          </button>
        </div>
      )
    }
    return (
      <div className="flex justify-center pt-8 pb-4 w-full">
        <Submit
          inputText={user_provided_area_name}
          userInputLength={user_provided_area_name.length + detail_text.length}
          maxUserInput={maxInput}
          loading={loading}
          runsRemaining={runsRemaining}
        />
      </div>
    )
  }

  const minimumAttractionsSelected = () => {
    const keys = Object.keys(selectedResults);
    const count = keys.reduce((acc, k) => acc + selectedResults[k].length, 0)
    return count >= 2;
  };

  const searchForm = () => {
    if (searchOpen && formState === 'search_form') {
      return (
        <SearchForm
          loading={loading}
          setLoading={setLoading}
          setErrors={setErrors}
          initialSearchTerm={inputFields.user_provided_area_name}
          canCloseSearch={minimumAttractionsSelected()}
          setSearchOpen={setSearchOpen}
          setSearchResult={handleSearchResult}
        />
      )
    }
  };

  const searchResults = () => {
    if (searchOpen && formState === 'result_form') {
      return (
        <SearchResults
          loading={loading}
          setLoading={setLoading}
          setErrors={setErrors}
          searchResult={currentSearchResult}
          selectedResults={selectedResults}
          toggleSelected={toggleSelected}
          resetForm={() => setFormState('search_form')}
          setSearchOpen={setSearchOpen}
        />
      )
    }
  };

  const detailsForm = () => {
    if (minimumAttractionsSelected() && !searchOpen) {
      return (
        <div>
          {detailsField()}
          {submitButton()}
        </div>
      )
    }
  };

  return (
    <form className="flex flex-col items-center w-full" onSubmit={submitForm}>
      <div className="flex flex-col w-4/5 max-w-2xl">
        <p className="my-4 text-sm">Add the name of the area you wish to write about. You can search and select attractions from multiple areas, then generate your description.</p>
        {textRow('Name of area','user_provided_area_name','e.g. Waterloo', true)}
        {attractionRow()}
        {searchForm()}
        {searchResults()}
        {detailsForm()}
        <div className="my-4 w-full h-px bg-gray-200"></div>
      </div>
    </form>
  )
};

DescriptionForm.propTypes = {
  formState: PropTypes.string,
  inputFields: PropTypes.object,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  setErrors: PropTypes.func,
  currentSearchResult: PropTypes.object,
  handleSearchResult: PropTypes.func,
  runsRemaining: PropTypes.number,
  selectedResults: PropTypes.object,
  setField: PropTypes.func,
  setFormState: PropTypes.func,
  submitForm: PropTypes.func,
  toggleSelected: PropTypes.func
}

export default DescriptionForm;
