import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';

const AreaForm = () => {
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState({ search_text: '' });
  const [result, setResult] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors]);

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    setResult(response.data.attractions);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/search_locations.json",
      {search_location: inputFields },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const textRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => {setField(key, e.target.value)}}
          className="w-full form-inline-field"
        />
      </div>
    )
  }

  const submitButton = () => {
    return (
      <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
        Search!
      </button>
    )
  }

  const toggleSelected = (placeId) => {
    if (selectedIds.includes(placeId)) {
      setSelectedIds(selectedIds.filter(id => id !== placeId));
    } else {
      setSelectedIds([ ...selectedIds, placeId ]);
    }
  }

  const attractionRow = (attraction) => {
    const ratingsCount = attraction.total_ratings > 1000 ? `${Math.round(attraction.total_ratings / 1000)}k` : attraction.total_ratings;
    return (
      <div className="w-full hover:bg-gray-100">
        <label className="w-full flex justify-between cursor-pointer py-1">
          <span className="flex-grow">{attraction.name}
            <span className="text-xs ml-2 font-semibold">
              4.2
            </span>
            <span className="text-xs italic text-gray-600 mr-2">
              <i className="text-yellow-400 fas fa-star mx-1"></i>
              ({ratingsCount} votes)
            </span>
          </span>
          <input
          type="checkbox"
          checked={selectedIds.includes(attraction.place_id)}
          onChange={() => toggleSelected(attraction.place_id)}
          className="cursor-pointer focus:ring-0"
          />
        </label>
      </div>
    )
  }

  const stationRow = (station) => {
    return (
      <div className="w-full hover:bg-gray-100">
        <label className="w-full flex justify-between cursor-pointer py-1">
          <span className="flex-grow">{station.name}
            <span className="text-xs ml-2">
              ({station.distance.distance} km, {station.distance.duration} min walk)
            </span>
          </span>
          <input
          type="checkbox"
          checked={selectedIds.includes(station.place_id)}
          onChange={() => toggleSelected(station.place_id)}
          className="cursor-pointer focus:ring-0"
          />
        </label>
      </div>
    )
  }

  const attractionSection = (attractions, sectionTitle, titleFunction) => {
    return (
      <div className="w-full flex-col justify-center">
        <p className="font-semibold">{sectionTitle}</p>
        <div className="mt-1 mb-1 w-full h-px bg-gray-300"></div>
        {attractions.map(a => titleFunction(a))}
      </div>
    )
  }

  const resultPanel = () => {
    console.log(selectedIds)
    if (result) {
      const topAttractions = result.attractions.slice(0,8);
      const filteredRestaurants = result.restaurants.filter(r => !(r.categories.includes("lodging")));
      return (
        <div className="flex justify-center w-full">
          <div className="w-4/5 text-sm">
            <p>Here's what we found nearby. Select the key features for your description and tap generate.</p>
            <br />
            {attractionSection(topAttractions, 'Attractions', attractionRow)}
            <br />
            {attractionSection(result.stations, 'Stations & Subways', stationRow)}
            <br />
            {attractionSection(filteredRestaurants, 'Restaurants, bars & more', attractionRow)}
            <br />
            {result.takeaways.length > 0 && <p className="font-semibold">Takeaways</p>}
            {result.takeaways.map(e => <p>{e.name} {e.rating} ({e.total_ratings}, {e.categories.join(",")})</p>)}
            <br />
            {result.cafes.length > 0 && <p className="font-semibold">Cafes</p>}
            {result.cafes.map(e => <p>{e.name} {e.rating} ({e.total_ratings}, {e.categories.join(",")})</p>)}
            <div className="w-full flex justify-center">
              <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
                Generate!
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
      <div className="w-4/5">
        <ErrorNotice errors={errors} />
      </div>
      <div className="flex flex-col w-4/5 max-w-2xl">
       {textRow('Location','search_text','e.g. postcode', true)}
        <div className="flex justify-center py-8 w-full">
          {submitButton()}
        </div>
      </div>
      <div className="py-4 w-full">
        {resultPanel()}
      </div>
    </form>
  )
}

export default AreaForm;
