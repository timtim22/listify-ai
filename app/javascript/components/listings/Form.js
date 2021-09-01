import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest, redirectOnSuccess } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';

const newListing = {
  request_type: 'description',
  property_type: '',
  sleeps: 2,
  location: '',
  details: ''
}

const Form = () => {
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
    redirectOnSuccess(response);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('listing', JSON.stringify(listing));
    createRequest(
      "/listings.json",
      listing,
      (response) => { handleRequestSuccess(response) },
      (e) => setErrors(e)
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

  return (
    <form className="w-full h-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center w-full">

       <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Listings generator</h1>
        <p className="text-sm">I want to generate a...</p>
        <div className="flex justify-center py-8">
          {pillButton("Description", "description")}
          {pillButton("Title", "title")}
          {pillButton("Ad for Google", "google_ad")}
          {pillButton("Ad for Facebook", "facebook_ad")}
        </div>
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col py-4 w-4/5 max-w-2xl">
          <div className="flex justify-start w-full">
            <div>
              <span>My listing is for a</span>
              <input
                type="text"
                placeholder="house, flat..."
                value={listing.property_type}
                onChange={(e) => {setField('property_type', e.target.value)}}
                className="form-inline-field"
              />
              <span>that sleeps</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  placeholder="2"
                  value={listing.sleeps}
                  onChange={(e) => {setField('sleeps', e.target.value)}}
                  className="w-16 form-inline-field"
                />
              <span>people.</span>
              <br />
              <br />
              <span>It is located in</span>
              <input
                type="text"
                placeholder="location"
                value={listing.location}
                onChange={(e) => {setField('location', e.target.value)}}
                className="form-inline-field"
              />
            <span>.</span>
            <br />
            <br />
            </div>
          </div>
          <label className="block mt-4 w-full">
            <span className="text-sm font-medium tracking-wider text-gray-500 uppercase">Additional details</span>
            <textarea
              value={listing.details}
              onChange={(e) => {setField('details', e.target.value)}}
              className="form-text-area">
            </textarea>
          </label>
          <div className="flex justify-center w-full">
            <button className="py-2 px-6 my-8 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
              Generate!
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Form;


