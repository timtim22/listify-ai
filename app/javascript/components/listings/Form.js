import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest, redirectOnSuccess } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Spinner from '../common/Spinner';

const newListing = {
  request_type: 'listing_description',
  //property_type: '',
  //sleeps: 2,
  //location: '',
  details: ''
}

const Form = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(newListing);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors])

  const setField = (field, value) => {
    setListing({ ...listing, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setLoading(false);
    onResult(response);
  }

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('listing', JSON.stringify(listing));
    createRequest(
      "/listings.json",
      listing,
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )

  }

  const pillButton = (title, value) => {
    const selected = listing.request_type === value;
    const styles   = selected ? 'pill-button-selected' : 'pill-button';
    return (
      <div
        className={styles}
        onClick={() => setField('request_type', value)}>
        {title}
      </div>
    )
  }

  const submitButton = () => {
    if (loading) { return <Spinner />; }
    return (
      <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
        Generate!
      </button>
    )
  }


  return (
    <form className="w-full h-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center w-full">
        <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Listings generator</h1>
        <p className="text-sm">I want to generate a...</p>
        <div className="flex justify-center py-8">
          {pillButton("Description", "listing_description")}
          {pillButton("Title", "listing_title")}
          {pillButton("Ad for Google", "listing_google_ad")}
          {pillButton("Ad for Facebook", "listing_facebook_ad")}
        </div>
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          <label className="block mt-4 w-full">
            <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">
              Property details
            </span>
            <textarea
              value={listing.details}
              onChange={(e) => {setField('details', e.target.value)}}
              placeholder="e.g. apartment near Covent Garden, third floor with balcony, sleeps 4..."
              className="h-48 form-text-area">
            </textarea>
          </label>
          <div className="flex justify-center py-8 w-full">
            {submitButton()}
          </div>
        </div>
      </div>
    </form>
  )
}

export default Form;


