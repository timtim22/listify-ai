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
    <div className="flex flex-col items-center w-full">
      <div className="p-4 w-full font-semibold tracking-wide text-gray-800 bg-purple-100">
        <p>
          Thanks for joining our private beta! We're still building our product, and making lots of improvements.
          Please do give us feedback, it really helps!
        </p>
      </div>
      <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Listings Generator</h1>
      <p className="text-sm">I want to generate a...</p>
      <div className="flex flex-col items-center py-2 md:flex-row md:justify-center md:items-start md:py-8">
        {pillButton("Description", "listing_description")}
        {pillButton("Title", "listing_title")}
        {pillButton("Area description", "neighbourhood")}
        {pillButton("Rooms", "room_description")}
      </div>
   </div>
  )
}

export default FormHeader;
