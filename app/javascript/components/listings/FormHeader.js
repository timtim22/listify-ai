import React from 'react';
import PropTypes from 'prop-types';
import { bannerForUser } from '../common/HeaderBanner';

const aboutUsers = [
  "197d4687-e3a9-40bb-948b-ec0285c3485e", //boostly
  "0948adc5-66c5-492d-aa43-77685cf86f11",  // casa
  "d5a62173-ec2b-4cf0-aca5-5bb296eeb710", // local test
  "62bbca78-c5af-48db-92a8-8a359f9fa1ef", //sunrisescots
]

const FormHeader = ({ user, formType, setFormType }) => {

  const navLink = (title, value, subtitle) => {
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

  const canSeeAbout = () => {
    return user.admin || aboutUsers.includes(user.id);
  };

  const canSeeCustomForm = () => {
    return user.admin || user.on_listify_team
  }

  return (
    <div className="flex overflow-x-hidden flex-col items-center w-full">
      <div className="p-4 w-full tracking-wide text-center text-gray-800 bg-grey-50">
        {bannerForUser(user)}
      </div>
      <div className="w-full overflow-scroll flex justify-center">
        <div className="flex flex-col justify-start items-center py-2 px-12 md:flex-row md:py-2 md:px-0">
          {navLink("Description", "listing_description")}
          {navLink("Title", "listing_title")}
          {navLink("Area", "neighbourhood")}
          {navLink("Rooms", "room_description")}
          {navLink("Listing builder", "listing_builder")}
          {navLink("Ads", "advert", "beta")}
          {canSeeAbout() && navLink("About", "about", "beta")}
          {canSeeCustomForm() && navLink("Custom form", "custom_form", "beta")}
        </div>
      </div>
      <div className="mb-8 w-full h-px bg-gray-200"></div>
   </div>
  )
}

FormHeader.propTypes = {
  user: PropTypes.object,
  formType: PropTypes.string,
  setFormType: PropTypes.func
}

export default FormHeader;
