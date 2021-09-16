import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import { cleanObjectInputText } from '../../helpers/utils';
import ErrorNotice from '../common/ErrorNotice';
import Spinner from '../common/Spinner';
import Submit from '../inputs/Submit';

const maxInput = 240;

const Form = ({ templateListing, runsRemaining, onResult }) => {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(templateListing);
  const [errors, setErrors] = useState(null);
  const [disabledMsg, setDisabledMsg] = useState(null);

  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors])

  const setField = (field, value) => {
    setListing({ ...listing, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    setLoading(false);
    onResult(response);
  }

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    createRequest(
      "/listings.json",
      cleanObjectInputText(listing),
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )

  }

  const disabledPopup = (value) => {
    if (disabledMsg === value) {
      return (
        <div className="relative">
          <div className="flex absolute left-0 top-1 justify-center w-32">
            <span className="text-xs text-gray-500">Coming Soon!</span>
          </div>
        </div>
      )
    }
  }

  const pillButton = (title, value) => {
    const selected = listing.request_type === value;
    return (
      <div
        className={`mt-6 md:mt-0 ${selected ? 'pill-button-selected' : 'pill-button'}`}
        onClick={() => setField('request_type', value)}>
        {title}
      </div>
    )
  }

  const disabledPillButton = (title, value) => {
    return (
      <div className="flex flex-col">
        <div
          className="self-center mt-6 md:mt-0 pill-button-disabled"
          onMouseOver={() => { !disabledMsg && setDisabledMsg(value) }}
          onMouseOut={() => { setDisabledMsg(null) }}>
          {title}
        </div>
        {disabledPopup(value)}
      </div>
    )
  }

  return (
    <form className="w-full h-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center w-full">
        <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Listings generator</h1>
        <p className="text-sm">I want to generate a...</p>
        <div className="flex flex-col items-center py-2 md:flex-row md:justify-center md:items-start md:py-8">
          {pillButton("Description", "listing_description")}
          {pillButton("Title", "listing_title")}
          {disabledPillButton("Other listing copy", "listing_other_copy")}
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
              value={listing.input_text}
              onChange={(e) => {setField('input_text', e.target.value)}}
              placeholder={`- apartment near Covent Garden\n- third floor with private balcony\n- close to theatres, bars and shops`}
              className="h-48 form-text-area">
            </textarea>
          </label>
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputObject={listing}
              loading={loading}
              runsRemaining={runsRemaining}
              maxInput={maxInput}
            />
          </div>
        </div>
      </div>
    </form>
  )
}

export default Form;


