import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import Submit from '../inputs/Submit';
import AreaAttractionList from './AreaAttractionList';

const maxInput = 200;

const AreaDescriptionForm = ({
  searchResult,
  descriptionParams,
  setDescriptionParams,
  handleTaskRun,
  runsRemaining,
  setErrors,
  loading,
  setLoading,
  resetForm,
  shouldGenerateFragment,
  onFragmentResponse
}) => {

  const [userInputLength, setUserInputLength] = useState(0);

  const cleanDetailText = (text) => {
    let cleanText = text.trim().replace(/\n-$/, "");
    if (cleanText.length > 0 && cleanText[cleanText.length-1] !== ".") {
      cleanText = cleanText + ".";
    }
    return cleanText;
  }

  const selectedResults = () => {
    return ({
      search_location_id: searchResult.id,
      search_results: searchResult.attractions,
      selected_ids: descriptionParams.selectedIds,
      detail_text: cleanDetailText(descriptionParams.detailText)
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    const resource = shouldGenerateFragment ? 'listing_fragment' : 'area_description';
    const requestType = shouldGenerateFragment ? 'area_description_fragment' : 'area_description';
    const onSuccess = shouldGenerateFragment ? onFragmentResponse : handleTaskRun;
    createRequest(
      `/${resource}s.json`,
      { [resource]: { ...selectedResults(), request_type: requestType }},
      (response) => { onSuccess(response) },
      (e) => { setErrors(e); setLoading(false); }
    )
  }

  const setField = (field, value) => {
    setDescriptionParams({ ...descriptionParams, [field]: value });
  }

  const setInputText = (value, trueUserInputLength) => {
    setUserInputLength(trueUserInputLength);
    setField('detailText', value);
  }

  const toggleSelected = (placeId) => {
    const { selectedIds } = descriptionParams;
    if (selectedIds.includes(placeId)) {
      setField('selectedIds', selectedIds.filter(id => id !== placeId));
    } else {
      setField('selectedIds', [ ...selectedIds, placeId ]);
    }
  }

  const detailsField = () => {
    return (
      <div className="flex flex-col justify-center w-full">
        <label className="font-semibold">Keywords or details for your description:</label>
        <div className="my-2 w-full">
          <TextareaWithPlaceholder
            value={descriptionParams.detailText}
            onChange={(value) => setInputText(value, value.length)}
            customClasses={"text-sm"}
            heightClass={"h-24"}
            placeholderContent={
            <div className="flex flex-col items-start mb-px">
              <p>- e.g. trendy neighbourhood</p>
              <p>- famous for nightlife</p>
              <p>- Great location for exploring the city</p>
            </div>
          } />
        </div>
      </div>
    )
  }


  const submitButton = () => {
    return (
      <div className="flex justify-center py-8 w-full">
        <Submit
          inputText={descriptionParams.detailText}
          userInputLength={userInputLength}
          maxUserInput={maxInput}
          loading={loading}
          runsRemaining={runsRemaining}
        />
      </div>
    )
  }

  if (searchResult) {
    const { attractions, restaurants, stations } = searchResult.attractions;
    const topAttractions = attractions.slice(0,8);

    return (
      <div className="w-full flex justify-center">
        <div className={`flex justify-center ${shouldGenerateFragment ? "w-full" : "w-4/5"}`}>
          <form className="text-sm mt-2" onSubmit={handleSubmit}>
            <p>Here's what we found nearby. For the best description, tick at least 3 boxes and add something to the keywords section. 
              Or <button onClick={resetForm} className="secondary-link">{` search again.`}</button>
            </p>
            <br />
            <AreaAttractionList
              attractions={topAttractions}
              attractionType={'attractions'}
              selectedIds={descriptionParams.selectedIds}
              toggleSelected={toggleSelected}
            />
            <br />
            <AreaAttractionList
              attractions={stations}
              attractionType={'stations'}
              selectedIds={descriptionParams.selectedIds}
              toggleSelected={toggleSelected}
            />
            <br />
            <AreaAttractionList
              attractions={restaurants}
              attractionType={'restaurants'}
              selectedIds={descriptionParams.selectedIds}
              toggleSelected={toggleSelected}
            />

            <p className="mt-4 text-xs text-right text-gray-300">Search results powered by Google Maps</p>
            <br />
            {detailsField()}
            {submitButton()}
          </form>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

AreaDescriptionForm.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  setErrors: PropTypes.func,
  searchResult: PropTypes.object,
  descriptionParams: PropTypes.object,
  setDescriptionParams: PropTypes.func,
  runsRemaining: PropTypes.number,
  handleTaskRun: PropTypes.func,
  resetForm: PropTypes.func,
  shouldGenerateFragment: PropTypes.bool,
  onFragmentResponse: PropTypes.func

}

export default AreaDescriptionForm;
