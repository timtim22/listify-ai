import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormHeader = ({ formType, setFormType }) => {

  const pillButton = (title, value) => {
    const selected = formType === value;
    return (
      <div
        title={title}
        className={`bold-pill flex-shrink-0 ${selected ? "sub-nav-button-selected" : "sub-nav-button" }`}
        onClick={() => { setFormType(value) }}>
        {title}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      <div className="p-4 w-full tracking-wide text-center text-gray-800 bg-grey-50">
        <div className="py-3 px-4 text-left rounded-b border-l-4 shadow border-t-1" role="alert">
          <div className="flex">
            <div className="py-1 text-teal-500">
              <svg className="mr-4 w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Thanks for joining our private beta! </p>
              <p className="text-sm">
                We're still making lots of improvements. Please give us feedback, it really helps!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 md:px-0 flex items-center py-2 flex-row justify-center overflow-x-auto md:py-2">
        {pillButton("Description", "listing_description")}
        {pillButton("Title", "listing_title")}
        {pillButton("Area description", "neighbourhood")}
        {pillButton("Rooms", "room_description")}
        {pillButton("Full listing", "full_listing")}
      </div>
      <div className="mb-8 w-full h-px bg-gray-200"></div>
   </div>
  )
}

export default FormHeader;
