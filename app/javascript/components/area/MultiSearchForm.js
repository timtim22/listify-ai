import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import { UserContext } from '../listings/New';
import ButtonPillWithClose from '../common/ButtonPillWithClose';

const newDescriptionParams = { user_provided_area_name: '', selected_ids: [], detail_text: '' };
const newResults = { attractions: [], stations: [], restaurants: []};

const MultiSearchForm = ({ loading, setLoading, handleTaskRun, runsRemaining }) => {
  const [errors, setErrors] = useState(null);
  const [inputFields, setInputFields] = useState(newDescriptionParams);
  const [currentSearchResult, setCurrentSearchResult] = useState(newResults);
  const [selectedResults, setSelectedResults] = useState(newResults);

  const [formState, setFormState] = useState('base_form');

  const user = useContext(UserContext);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const descriptionParams = () => {
        return {
      ...inputFields,
      search_results: selectedResults,
      selected_ids: selectedIds(),
      request_type: 'area_description'
    }
  };

  const selectedIds = () => {
    return Object.keys(selectedResults)
      .map(k => selectedResults[k])
      .flat()
      .map(r => r.place_id)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    createRequest(
      `/area_descriptions.json`,
      { area_description: descriptionParams() },
      (response) => handleTaskRun(response),
      (e) => { setErrors(e); setLoading(false); }
    )
  };

  const handleSearchResult = (newResult) => {
    setCurrentSearchResult(newResult);
    setField('search_location_id', newResult.search_location_id);
    setFormState('result_form');
  };

  const toggleSelected = (placeId, placeType) => {
    let placeTypeResults = [...selectedResults[placeType]]
    if (placeTypeResults.find(record => record.place_id === placeId)) {
      setSelectedResults({
        ...selectedResults,
        [placeType]: placeTypeResults.filter(record => record.place_id !== placeId)
      });
    } else {
      const result = currentSearchResult[placeType].find(record => record.place_id === placeId);
      setSelectedResults({
        ...selectedResults,
        [placeType]: [...placeTypeResults, result ]
      });
    }
  }



  const attractionRow = () => {
    return (
      <div className="flex justify-start items-center my-2 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm">Selected attractions</label>
        {selectedAttractionList()}
      </div>
    )
  };

  const selectedAttractionList = () => {
    const categories = Object.keys(selectedResults);
    if (inputFields.user_provided_area_name.length < 3) {
      return <span className="text-sm mx-4">-</span>;
    } else if (formState === 'base_form') {
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
          -
        </span>
      )
    } else {
      return (
        <div>
          {categories.map((category) => {
            return selectedResults[category].map(place => attractionPill(place, category))
          })}
        </div>
      )
    }
  };

  const attractionPill = (place, placeType) => {
    return (
      <span key={place.place_id} className="m-1">
        <ButtonPillWithClose
          name={place.name}
          onClick={() => toggleSelected(place.place_id, placeType)}
        />
      </span>
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

  const searchForm = () => {
    if (formState === 'search_form') {
      return (
        <SearchForm
          loading={loading}
          setLoading={setLoading}
          setErrors={setErrors}
          initialSearchTerm={inputFields.user_provided_area_name}
          setSearchResult={handleSearchResult}
        />
      )
    }
  };

  const searchResults = () => {
    if (formState === 'result_form') {
      return (
        <SearchResults
          loading={loading}
          setLoading={setLoading}
          setErrors={setErrors}
          searchResult={currentSearchResult}
          selectedResults={selectedResults}
          toggleSelected={toggleSelected}
          resetForm={() => setFormState('search_form')}
        />
      )
    }
  };

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
    return count < 3;
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="self-center w-4/5 text-sm">
        <ErrorNotice errors={errors} />
      </div>

      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {textRow('Location name (this will be used in results)','user_provided_area_name','e.g. Waterloo, London', true)}
          {attractionRow()}
          <div className="flex justify-center py-8 w-full">
            {submitButton()}
          </div>
          <div className="my-4 w-full h-px bg-gray-200"></div>
        </div>
      </form>
      {searchForm()}
      {searchResults()}
    </div>
  )
};


MultiSearchForm.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  runsRemaining: PropTypes.number,
  handleTaskRun: PropTypes.func
}

export default MultiSearchForm;
