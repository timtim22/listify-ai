import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import GeneratingSpinner from '../common/GeneratingSpinner';
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
  setLoading
}) => {

  const [userInputLength, setUserInputLength] = useState(0);

  const cleanDetailText = (text) => {
    let cleanText = text.trim();
    if (cleanText[cleanText.length-1] !== ".") { cleanText = cleanText + "." }
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
    setLoading(true);
    createRequest(
      "/area_descriptions.json",
      { area_description: selectedResults() },
      (response) => { handleTaskRun(response) },
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
    if (loading) { return <GeneratingSpinner />; }
    return (
      <div className="flex justify-center py-4 w-full">
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
      <div className="py-4 px-6 w-full">
        <div className="flex justify-center w-full">
          <form className="w-4/5 text-sm" onSubmit={handleSubmit}>
            <p>Here's what we found nearby. Select the key features for your description and tap generate.</p>
            <br />
            {attractionSection(topAttractions, 'Attractions', attractionRow)}
            <br />
            {attractionSection(results.stations, 'Stations & Subways', stationRow)}
            <br />
            {attractionSection(filteredRestaurants, 'Restaurants, bars & more', attractionRow)}
            <p class="mt-4 text-right text-xs text-gray-300 font-bold">Search results powered by Google Maps</p>
            <br />
            {detailsField()}
            <br />
            {submitButton()}
          </form>
        </div>
      </div>
    )
  } else {
    return null;
  }
}

export default AreaDescriptionForm;
