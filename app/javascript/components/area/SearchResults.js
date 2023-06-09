import React from 'react';
import PropTypes from 'prop-types';
import AreaAttractionList from '../listings/AreaAttractionList';

const SearchResults = ({
  searchResult,
  selectedResults,
  toggleSelected,
  resetForm,
  setSearchOpen
}) => {

  const noResultsMessage = () => {
    return (
      <div className="text-center mt-4 text-sm">
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
      <div className="w-full text-sm">
        <div className="flex justify-center w-full py-4">
          <h2 className="text-lg font-medium">Search</h2>
        </div>
        <p>Here is what we found nearby. Looking for more?
          <button type='button' onClick={resetForm} className="secondary-link ml-2">Try another search.</button>
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
    <div className="bg-gray-50 self-center border border-gray-200 rounded-lg w-full">
      <div className="w-full flex flex-col items-center">
        <div className="flex justify-center w-4/5">
          {!attractionsFound && noResultsMessage()}
          {attractionsFound && attractionForm(topAttractions, stations, restaurants)}
        </div>
        <button
          type='button'
          onClick={() => setSearchOpen(false)}
          className="primary-button-purple mb-4"
        >
        Close search</button>
      </div>
    </div>
  )
};

SearchResults.propTypes = {
  searchResult: PropTypes.object,
  selectedResults: PropTypes.object,
  toggleSelected: PropTypes.func,
  resetForm: PropTypes.func,
  setSearchOpen: PropTypes.func
}

export default SearchResults;
