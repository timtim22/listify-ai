import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import Submit from '../inputs/Submit';

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

  const filterRestaurants = (restaurants) => {
    const hotels = restaurants.filter((r) => {
      return r.categories.includes("lodging")
    }).map(r => r.place_id);
    if (hotels.length > 5) {
      return restaurants.filter(r => !(hotels.includes(r.place_id))).slice(0, 8);
    } else {
      return restaurants.slice(0, 8);
    }
  }

  const checkboxFor = (attraction) => {
    return (
      <input
        type="checkbox"
        checked={descriptionParams.selectedIds.includes(attraction.place_id)}
        onChange={() => toggleSelected(attraction.place_id)}
        className="mx-1 cursor-pointer focus:ring-0"
      />
    )
  }

  const pillIcon = (name) => {
    return (
      <span className="py-0.5 px-2 mr-2 font-semibold tracking-wider bg-blue-100 rounded-full shadow-sm">
        {name}
      </span>
    )
  }

  const attractionRow = (attraction) => {
    const ratingsCount = attraction.total_ratings > 1000 ? `${Math.round(attraction.total_ratings / 1000)}k` : attraction.total_ratings;
    return (
      <div key={attraction.place_id} className="w-full hover:bg-gray-100">
        <label className="flex justify-between items-center py-1 w-full cursor-pointer">
          <span className="flex-grow">{attraction.name}
            <span className="ml-2 text-xs font-semibold">
              {attraction.categories.includes("meal_takeaway") && !attraction.categories.includes("cafe") && pillIcon("takeaway")}
              {attraction.categories.includes("cafe") && pillIcon("cafe")}
              {attraction.rating}
            </span>
            <span className="mr-2 text-xs italic text-gray-600">
              <i className="mx-1 text-yellow-400 fas fa-star"></i>
              ({ratingsCount} votes)
            </span>
          </span>
          {checkboxFor(attraction)}
        </label>
      </div>
    )
  }

  const stationRow = (station) => {
    const { distance, duration } = station.distance;
    const durationSubstring =  duration < 26 ? `, ${duration} min walk` : "";
    return (
      <div key={station.place_id} className="w-full hover:bg-gray-100">
        <label className="flex justify-between items-center py-1 w-full cursor-pointer">
          <span className="flex-grow">
            {station.name}
            <span className="ml-2 text-xs">
              {station.categories.includes("subway_station") && pillIcon("subway")}
              {station.categories.includes("light_rail_station") && pillIcon("light rail")}
              ({distance} km{durationSubstring})
            </span>
          </span>
          {checkboxFor(station)}
        </label>
      </div>
    )
  }

  const attractionSection = (attractions, sectionTitle, titleFunction) => {
    const noResult = <p>We didn't find anything to show here. </p>;
    const content = attractions.length > 0 ? attractions.map(a => titleFunction(a)) : noResult;
    return (
      <div className="flex-col justify-center w-full">
        <p className="font-semibold">{sectionTitle}</p>
        <div className="my-2 w-full h-px bg-gray-300"></div>
        {content}
      </div>
    )
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
    const results = searchResult.attractions;
    const topAttractions = results.attractions.slice(0,8);
    const filteredRestaurants = filterRestaurants(results.restaurants);

    return (
      <div className="w-full flex justify-center">
        <div className={`flex justify-center ${shouldGenerateFragment ? "w-full" : "w-4/5"}`}>
          <form className="text-sm mt-2" onSubmit={handleSubmit}>
            <p>Here's what we found nearby. For the best description, tick at least 3 boxes and add something to the keywords section. 
              Or <button onClick={resetForm} className="secondary-link">{` search again.`}</button>
            </p>
            <br />
            {attractionSection(topAttractions, 'Attractions', attractionRow)}
            <br />
            {attractionSection(results.stations, 'Stations & Subways', stationRow)}
            <br />
            {attractionSection(filteredRestaurants, 'Restaurants, bars & more', attractionRow)}
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
