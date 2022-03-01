import React from 'react';
import PropTypes from 'prop-types';

const AreaAttractionList = ({
  attractions,
  attractionType,
  selectedIds,
  toggleSelected
}) => {

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

  const attractionSection = (attractions, sectionTitle, titleFunction) => {
    const noResult = <p>{`We didn't find anything to show here. `}</p>;
    const content = attractions.length > 0 ? attractions.map(a => titleFunction(a)) : noResult;
    return (
      <div className="flex-col justify-center w-full">
        <p className="font-semibold">{sectionTitle}</p>
        <div className="my-2 w-full h-px bg-gray-300"></div>
        {content}
      </div>
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

  const pillIcon = (name) => {
    return (
      <span className="py-0.5 px-2 mr-2 font-semibold tracking-wider bg-blue-100 rounded-full shadow-sm">
        {name}
      </span>
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

  if (attractionType === 'attractions') {
    return (
      attractionSection(attractions, 'Attractions', attractionRow)
    )
  } else if (attractionType === 'stations') {
    return (
      attractionSection(attractions, 'Stations & Subways', stationRow)
    )
  } else {
    const restaurants = filterRestaurants(attractions);
    return (
      attractionSection(restaurants, 'Restaurants, bars & more', attractionRow)
    )
  }
};

AreaAttractionList.propTypes = {
  attractions: PropTypes.array,
  attractionType: PropTypes.string,
  selectedIds: PropTypes.array,
  toggleSelected: PropTypes.func
}

export default AreaAttractionList;
