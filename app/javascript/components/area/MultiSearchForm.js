import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../listings/New';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import DescriptionForm from './DescriptionForm';

const newDescriptionParams = { user_provided_area_name: '', selected_ids: [], detail_text: '' };
const newResults = { attractions: [], stations: [], restaurants: []};

const MultiSearchForm = ({ loading, setLoading, handleTaskRun, runsRemaining, setFormType }) => {
  const [errors, setErrors] = useState(null);
  const [inputFields, setInputFields] = useState(newDescriptionParams);
  const [currentSearchResult, setCurrentSearchResult] = useState(newResults);
  const [selectedResults, setSelectedResults] = useState(newResults);

  const [formState, setFormState] = useState('base_form');

  const user = useContext(UserContext);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

    const cleanDetailText = (text) => {
    let cleanText = text.trim().replace(/\n-$/, "");
    if (cleanText.length > 0 && cleanText[cleanText.length-1] !== ".") {
      cleanText = cleanText + ".";
    }
    return cleanText;
  }

  const descriptionParams = () => {
        return {
      ...inputFields,
      detail_text: cleanDetailText(inputFields.detail_text),
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
        runsRemaining={runsRemaining}
        submitForm={handleSubmit}
        setErrors={setErrors}
        setLoading={setLoading}
        currentSearchResult={currentSearchResult}
        handleSearchResult={handleSearchResult}
      />
    )
  };


  const bannerText = () => {
    return (
      <span>
        We are still developing this feature; please give us feedback. You can switch to the old version
        <span className='cursor-pointer font-semibold' onClick={() => setFormType('neighbourhood')}> here</span>.
      </span>
    )
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="flex w-4/5 self-center max-w-2xl justify-center mb-4">
        <Banner
          title="Welcome to the new area search"
          text={bannerText()}
          />
      </div>
      <div className="self-center w-4/5 text-sm">
        <ErrorNotice errors={errors} />
      </div>
      {descriptionForm()}
      <div className="w-full flex justify-center mt-4 mb-8">
      </div>
    </div>
  )
};

MultiSearchForm.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  runsRemaining: PropTypes.number,
  handleTaskRun: PropTypes.func,
  setFormType: PropTypes.func
}

// Temporary banner

const Banner = ({ title, text }) => {
  const borderColor = 'border-teal-500';
  const iconColor   = 'text-teal-500';

  return (
    <div style={{ backgroundColor: '#f0fdfa' }} className={`w-full py-3 px-4 text-left rounded-b border-l-4 ${borderColor} shadow border-t-1`} role="alert">
      <div className="flex items-center">
        <div className={`py-1 ${iconColor}`}>
          <svg className="mr-4 w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
          </svg>
        </div>
        <div className="text-teal-800">
          <p className="font-bold">{title}</p>
          <p className="text-sm">{text}</p>
        </div>
      </div>
    </div>
  )
}

Banner.propTypes = {
  title: PropTypes.string,
  text: PropTypes.object,
}

export default MultiSearchForm;
