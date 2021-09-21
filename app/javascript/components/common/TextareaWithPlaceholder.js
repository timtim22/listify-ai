import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TextareaWithPlaceholder = ({ value, onChange, placeholderContent }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

    useEffect(() => {
    if (showPlaceholder && value && value.length > 0) {
      setShowPlaceholder(false);
    } else if (!showPlaceholder && value.length === 0) {
      setShowPlaceholder(true);
    }
  }, [value]);

  return (
    <div className="w-full relative z-10">
      <textarea
        value={value}
        onChange={(e) => { onChange(e.target.value) }}
        className={`h-48 form-text-area z-20 ${showPlaceholder ? "bg-transparent" : "bg-white" }`}>
      </textarea>
      <div className="h-48 px-3 py-2 top-0 left-0 absolute -z-10 w-full rounded-md text-gray-400">
        {placeholderContent}
      </div>
    </div>
  )
}

TextareaWithPlaceholder.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholderContent: PropTypes.element
};


export default TextareaWithPlaceholder;

