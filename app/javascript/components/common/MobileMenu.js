import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MobileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuDropdown = () => {
    if (menuOpen) {
      return (
        <div className="absolute right-0 py-1 mt-4 w-48 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
          <a href="/users/edit" className="block py-2 px-4 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="dd-account-link">Account</a>
          <a href="/users/sign_out" className="block py-2 px-4 text-sm text-gray-700" data-method="delete" role="menuitem" tabIndex="-1" id="dd-sign-out-link">Sign out</a>
        </div>
      )
    }
  }

  const openButton = () => {
    return (
      <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )
  }

  const closeButton = () => {
    return (
      <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex justify-center items-center p-2 text-white bg-purple-800 rounded-md hover:text-white hover:bg-purple-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-800 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-controls="mobile-menu"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        {!menuOpen && openButton()}
        {menuOpen && closeButton()}
      </button>
      {menuDropdown()}
    </>
  )
}

export default MobileMenu;

