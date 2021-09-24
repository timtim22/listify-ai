import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DisabledPillButton = ({ title }) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const popup = () => {
    if (popupVisible) {
      return (
        <div className="relative">
          <div className="flex absolute left-0 top-1 justify-center w-32">
            <span className="text-xs text-gray-500">Coming Soon!</span>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col">
      <div
        className="self-center mt-6 md:mt-0 pill-button-disabled"
        onMouseOver={() => { !popupVisible && setPopupVisible(true) }}
        onMouseOut={() => { setPopupVisible(false) }}>
        {title}
      </div>
      {popup()}
    </div>
  )
}

DisabledPillButton.propTypes = {
  title: PropTypes.string
};


export default DisabledPillButton;

