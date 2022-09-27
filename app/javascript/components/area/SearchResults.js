import React from 'react';
import PropTypes from 'prop-types';
import AreaAttractionList from '../listings/AreaAttractionList';

const SearchResults = ({
  searchResult,
  selectedResults,
  toggleSelected,
  resetForm
}) => {

  const noResultsMessage = () => {
    return (
      <div className="text-center">
        {"Sorry, we couldn't find anything for this search. You could try a different search term; generally the names of towns, cities or smaller local areas work better than countries or specific addresses. If changing the search term doesn't help, please let us know."}
        <div className="flex justify-center py-8 w-full">
          <button type='button' onClick={resetForm} className="primary-button">
            Search again
          </button>
        </div>
      </div>
    )
  };

  const attractionForm = (topAttractions, stations, restaurants) => {
    return (
      <div className="w-full text-sm mt-2">
        <div className="w-full flex text-base items-center">
          <h2>Search Results</h2>
        </div>
        <p>Here is what we found nearby.
          <button type='button' onClick={resetForm} className="secondary-link ml-2">Edit your search.</button>
        </p>
        <br />
        <AreaAttractionList
          attractions={topAttractions}
          attractionType={'attractions'}
          selectedIds={selectedResults['attractions'].map(r => r.place_id)}
          toggleSelected={(placeId) => toggleSelected(placeId, 'attractions')}
        />
        <br />
        <AreaAttractionList
          attractions={stations}
          attractionType={'stations'}
          selectedIds={selectedResults['stations'].map(r => r.place_id)}
          toggleSelected={(placeId) => toggleSelected(placeId, 'stations')}
        />
        <br />
        <AreaAttractionList
          attractions={restaurants}
          attractionType={'restaurants'}
          selectedIds={selectedResults['restaurants'].map(r => r.place_id)}
          toggleSelected={(placeId) => toggleSelected(placeId, 'restaurants')}
        />

        <p className="mt-4 text-xs text-right text-gray-300">Search results powered by Google Maps</p>
        <br />
      </div>
    )
  };

  const { attractions, restaurants, stations } = searchResult;
  const topAttractions = attractions.slice(0,8);
  const attractionsFound = attractions.length + restaurants.length + stations.length > 0;

  return (
    <div className="w-full flex justify-center">
      <div className="flex justify-center w-4/5">
        {!attractionsFound && noResultsMessage()}
        {attractionsFound && attractionForm(topAttractions, stations, restaurants)}
      </div>
    </div>
  )
};

SearchResults.propTypes = {
  searchResult: PropTypes.object,
  selectedResults: PropTypes.object,
  toggleSelected: PropTypes.func,
  resetForm: PropTypes.func
}

export default SearchResults;
