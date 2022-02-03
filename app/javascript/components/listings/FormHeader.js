import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormHeader = ({ user, formType, setFormType }) => {

  const pillButton = (title, value, subtitle) => {
    const selected = formType === value;
    return (
      <div
        title={title}
        className={`bold-pill flex-shrink-0 ${selected ? "sub-nav-button-selected" : "sub-nav-button" }`}
        onClick={() => { setFormType(value) }}>
        {title}{subtitle && <span className="font-normal align-top text-xs text-green-600"> {subtitle}</span>}
      </div>
    )
  }

  const bannerForUser = () => {
    if (user.subscription_status === "on_trial") {
      return trialBanner()
    } else {
      return betaBanner();
    }
  }

  const banner = (title, text) => {
    return (
      <div className="py-3 px-4 text-left rounded-b border-l-4 border-teal-500 shadow border-t-1" role="alert">
        <div className="flex items-center">
          <div className="py-1 text-teal-500">
            <svg className="mr-4 w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm">{text}</p>
          </div>
        </div>
      </div>
    )
  }


  const trialBanner = () => {
    const end = new Date(user.trial_end_date);
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    if (today <= end) {
      const endStr = end.toLocaleDateString('en-gb', { weekday:"long", month:"long", day:"numeric"})
      return banner(
        "Welcome to your free trial of Listify!",
        `Your trial is active until ${endStr}. If there is anything we can help with please email hello@listify.ai.`
      )
    } else {
      return banner(
        "Your trial has expired",
        `You can continue using Listify with a subscription. Contact us if you need help.`
      )
    }
  }

  const betaBanner = () => {
    return banner(
      "Need any help?",
      "Get in touch with us at hello@listify.ai if you need help or have any feedback."
    )
  }

  return (
    <div className="flex overflow-x-hidden flex-col items-center w-full">
      <div className="p-4 w-full tracking-wide text-center text-gray-800 bg-grey-50">
        {bannerForUser()}
      </div>
      <div className="w-full overflow-scroll flex justify-center">
        <div className="flex flex-col justify-start items-center py-2 px-12 md:flex-row md:py-2 md:px-0">
          {pillButton("Description", "listing_description")}
          {pillButton("Title", "listing_title")}
          {pillButton("Area", "neighbourhood")}
          {pillButton("Rooms", "room_description")}
          {pillButton("Listing builder", "listing_builder", "beta")}
          {pillButton("Full listing", "full_listing")}
        </div>
      </div>
      <div className="mb-8 w-full h-px bg-gray-200"></div>
   </div>
  )
}

export default FormHeader;
