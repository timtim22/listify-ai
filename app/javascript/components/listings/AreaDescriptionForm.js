import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';

const classificationGroups = {
  attraction: ['tourist_attraction'],
  restaurant: ['restaurant', 'bar'],
  station: ['train_station', 'subway_station', 'light_rail_station']
}

const AreaDescriptionForm = ({
  searchResult,
  selectedIds,
  toggleSelected,
  setDescriptionResult,
  setErrors,
  loading,
  setLoading
}) => {

  const handleRequestSuccess = (response) => {
    setErrors(null);
    setDescriptionResult(response.data.area_description);
  }

  const selectedResults = () => {
    return { search_results: searchResult, selected_ids: selectedIds };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/area_descriptions.json",
      { area_description: selectedResults() },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
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

  const attractionRow = (attraction) => {
    const ratingsCount = attraction.total_ratings > 1000 ? `${Math.round(attraction.total_ratings / 1000)}k` : attraction.total_ratings;
    return (
      <div key={attraction.place_id} className="w-full hover:bg-gray-100">
        <label className="flex justify-between items-center py-1 w-full cursor-pointer">
          <span className="flex-grow">{attraction.name}
            <span className="ml-2 text-xs font-semibold">
              4.2
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
    return (
      <div key={station.place_id} className="w-full hover:bg-gray-100">
        <label className="flex justify-between items-center py-1 w-full cursor-pointer">
          <span className="flex-grow">{station.name}
            <span className="ml-2 text-xs">
              ({station.distance.distance} km, {station.distance.duration} min walk)
            </span>
          </span>
          {checkboxFor(station)}
        </label>
      </div>
    )
  }

  const attractionSection = (attractions, sectionTitle, titleFunction) => {
    return (
      <div className="flex-col justify-center w-full">
        <p className="font-semibold">{sectionTitle}</p>
        <div className="my-2 w-full h-px bg-gray-300"></div>
        {attractions.map(a => titleFunction(a))}
      </div>
    )
  }

  const resultPanel = () => {
    const topAttractions = searchResult.attractions.slice(0,8);
    const filteredRestaurants = searchResult.restaurants.filter(r => !(r.categories.includes("lodging")));
    return (
      <div className="flex justify-center w-full">
        <form className="w-4/5 text-sm" onSubmit={handleSubmit}>
          <p>Here's what we found nearby. Select the key features for your description and tap generate.</p>
          <br />
          {attractionSection(topAttractions, 'Attractions', attractionRow)}
          <br />
          {attractionSection(searchResult.stations, 'Stations & Subways', stationRow)}
          <br />
          {attractionSection(filteredRestaurants, 'Restaurants, bars & more', attractionRow)}
          <br />
          {searchResult.takeaways.length > 0 && <p className="font-semibold">Takeaways</p>}
          {searchResult.takeaways.map(e => <p>{e.name} {e.rating} ({e.total_ratings}, {e.categories.join(",")})</p>)}
          <br />
          {searchResult.cafes.length > 0 && <p className="font-semibold">Cafes</p>}
          {searchResult.cafes.map(e => <p>{e.name} {e.rating} ({e.total_ratings}, {e.categories.join(",")})</p>)}
          <div className="flex justify-center py-8 w-full">
            <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
              Generate!
            </button>
          </div>
        </form>
      </div>
    )
  }



  if (searchResult) {
    return (
      <div className="py-4 w-full">
        {resultPanel()}
      </div>
    )
  } else {
    return null;
  }
}

export default AreaDescriptionForm;
