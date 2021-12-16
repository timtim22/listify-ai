import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormHeader = ({ formType, setFormType }) => {

  const pillButton = (title, value) => {
    const selected = formType === value;
    return (
      <div
        className={`mt-6 md:mt-0 ${selected ? 'pill-button-selected' : 'pill-button'}`}
        onClick={() => { setFormType(value) }}>
        {title}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-1/2 border-r-2">
      <div className="text-center p-4 w-full tracking-wide text-gray-800 bg-grey-50">
        <div class="border-l-4 border-t-2 rounded-b text-left px-4 py-3 shadow" role="alert">
          <div class="flex">
            <div class="py-1">
              <svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
          <div>
            <p class="font-bold">Thanks for joining our private beta for listings generator! </p>
            <p class="text-sm">
              We're still building our product, and making lots of improvements.
              Please do give us feedback, it really helps!
            </p>
          </div>
        </div>
        </div>
      </div>
      <div className="flex flex-col items-center py-2 md:flex-row md:justify-center md:items-start md:py-8">
        {pillButton("Description", "listing_description")}
        {pillButton("Title", "listing_title")}
        {pillButton("Area description", "neighbourhood")}
        {pillButton("Rooms", "room_description")}
        {pillButton("Full listing", "full_listing")}
      </div>
   </div>
  )
}

export default FormHeader;
