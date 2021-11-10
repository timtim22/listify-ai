import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import GeneratingSpinner from '../common/GeneratingSpinner';

const AreaDescriptionForm = ({
  searchResult,
  selectedIds,
  setSelectedIds,
  descriptionResults,
  resetDescriptionResults,
  handleTaskRun,
  setErrors,
  loading,
  setLoading
}) => {

  const selectedResults = () => {
    return ({
      search_location_id: searchResult.id,
      search_results: searchResult.attractions,
      selected_ids: selectedIds
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

  const toggleSelected = (placeId) => {
    if (descriptionResults.length > 0) { resetDescriptionResults(); }
    if (selectedIds.includes(placeId)) {
      setSelectedIds(selectedIds.filter(id => id !== placeId));
    } else {
      setSelectedIds([ ...selectedIds, placeId ]);
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
        checked={selectedIds.includes(attraction.place_id)}
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

  const submitButton = () => {
    if (loading) { return <GeneratingSpinner />; }
    return (
      <div className="flex justify-center py-4 w-full">
        <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
          Generate!
        </button>
      </div>
    )
  }

  if (searchResult) {
    const results = searchResult.attractions;
    const topAttractions = results.attractions.slice(0,8);
    const filteredRestaurants = filterRestaurants(results.restaurants);

    return (
      <div className="py-4 w-full">
        <div className="flex justify-center w-full">
          <form className="w-4/5 text-sm" onSubmit={handleSubmit}>
            <p>Here's what we found nearby. Select the key features for your description and tap generate.</p>
            <br />
            {attractionSection(topAttractions, 'Attractions', attractionRow)}
            <br />
            {attractionSection(results.stations, 'Stations & Subways', stationRow)}
            <br />
            {attractionSection(filteredRestaurants, 'Restaurants, bars & more', attractionRow)}
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
