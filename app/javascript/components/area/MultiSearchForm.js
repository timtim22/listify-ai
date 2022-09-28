import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../listings/New';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import DescriptionForm from './DescriptionForm';

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

  const descriptionForm = () => {
    return (
      <DescriptionForm
        loading={loading}
        formState={formState}
        setFormState={setFormState}
        inputFields={inputFields}
        setField={setField}
        selectedResults={selectedResults}
        toggleSelected={toggleSelected}
        submitForm={handleSubmit}
      />
    )
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="self-center w-4/5 text-sm">
        <ErrorNotice errors={errors} />
      </div>
      {descriptionForm()}
      <div className="w-full flex justify-center mt-4 mb-8">
        {searchForm()}
        {searchResults()}
      </div>
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
