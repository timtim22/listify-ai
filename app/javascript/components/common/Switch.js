import React from 'react';
import PropTypes from 'prop-types';

const Switch = ({ id, isOn, handleToggle, leftLabel, rightLabel }) => {
  const switchId = id || 'toggleSwitch';

  return (
    <div className="w-full md:w-auto flex justify-between md:justify-start items-center md:mr-2 mb-2">
      {leftLabel && <label className="text-gray-400 font-medium text-xs uppercase tracking-widest mr-4">{leftLabel}</label>}
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
      {rightLabel && <label className="text-gray-400 font-medium text-xs uppercase tracking-widest ml-4">{rightLabel}</label>}
    </div>
  );
};

export default Switch;

