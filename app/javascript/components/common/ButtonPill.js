import React from 'react';
import PropTypes from 'prop-types';

const ButtonPill = ({ name, onClick }) => {
  return (
    <button
      type="button"
      className="rounded-full px-2 py-1 mr-2 mb-4 text-xs bg-gray-200"
      onClick={onClick}
    >
      {name}
    </button>
  )
};

ButtonPill.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func,
}

export default ButtonPill;
