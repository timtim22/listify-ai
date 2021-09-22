import React from 'react';
import PropTypes from 'prop-types';

const Switch = ({ id, isOn, handleToggle, leftLabel, rightLabel }) => {
  const switchId = id || 'toggleSwitch';

  return (
    <div className="flex justify-start justify-between items-center mt-2 mr-2 mb-2 md:mt-0">
      {leftLabel && <label className="mr-4 text-xs font-medium tracking-widest text-gray-400 uppercase">{leftLabel}</label>}
      <input
        checked={isOn || false}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={switchId}
        type="checkbox"
      />
      <label
        className="react-switch-label"
        htmlFor={switchId}
      >
        <span className={`react-switch-button`} />
      </label>
      {rightLabel && <label className="ml-4 text-xs font-medium tracking-widest text-gray-400 uppercase">{rightLabel}</label>}
    </div>
  );
};

export default Switch;

