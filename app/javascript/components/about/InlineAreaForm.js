import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import AreaAttractionList from '../listings/AreaAttractionList';

const InlineAreaForm = ({ location, loading, setLoading, setParentField }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (searchResult) { updateParentState(); }
  }, [selectedIds]);

  useEffect(() => {
    if (searchResult) {
      setSelectedIds([]);
      setSearchResult(null);
    }
  }, [location]);

  const updateParentState = () => {
    const attractionNames = searchResult.attractions.attractions
      .filter(a => selectedIds.includes(a.place_id))
      .map(a => a.name)

    setParentField('attractions', attractionNames);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchResult(null);
    createRequest(
      "/search_locations.json",
      {search_location: { search_text: location } },
      (response) => { handleRequestSuccess(response) },
      (e) => { console.log(e); setErrors(e); setLoading(false); }
    )
  }

  const handleRequestSuccess = (response) => {
    setLoading(false);
    setErrors(null);

    setSearchResult({
      id: response.data.search_location.id,
      attractions: response.data.attractions
    });
  }

  const toggleSelectedAttraction = (placeId) => {
    if (selectedIds.includes(placeId)) {
      setSelectedIds(selectedIds.filter(id => id !== placeId));
    } else {
      setSelectedIds([ ...selectedIds, placeId ]);
    }
  }

  const attractionFormLink = () => {
    const disabled = location.length < 3 || searchResult;
    return (
      <div className="flex justify-start items-center mt-2 py-3 w-full">
        <label className="flex-shrink-0 w-1/3">Attractions nearby</label>
        <button
          type="button"
          disabled={disabled}
          onClick={handleSearchSubmit}
          className={`mx-3 ${disabled ? 'text-gray-400 cursor-not-allowed font-medium' : 'font-medium secondary-link'}`}>
            Select attractions in this area
        </button>
      </div>
    )
  };

  const resultForm = () => {
    if (searchResult) {
      const topAttractions = searchResult.attractions.attractions.slice(0,8);
      return (
        <div className="w-full flex justify-center">
          <div className={`flex justify-center w-full mr-3`}>
            <div className="w-full text-sm mt-2">
             <br />
              <AreaAttractionList
                attractions={topAttractions}
                attractionType={'attractions'}
                selectedIds={selectedIds}
                toggleSelected={toggleSelectedAttraction}
              />
              <p className="mt-4 text-xs text-right text-gray-300">Search results powered by Google Maps</p>
              <br />
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  };

  return (
    <>
      {attractionFormLink()}
      <div className="self-center w-full text-sm">
        <ErrorNotice errors={errors} />
      </div>
      {resultForm()}
    </>
  )

};

InlineAreaForm.propTypes = {
  location: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  setParentField: PropTypes.func
}

export default InlineAreaForm;
