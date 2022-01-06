import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TextareaWithPlaceholder = ({ value, onChange, placeholderContent, customClasses, heightClass = "h-32" }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

    useEffect(() => {
    if (showPlaceholder && value && value.length > 0) {
      setShowPlaceholder(false);
    } else if (!showPlaceholder && value.length === 0) {
      setShowPlaceholder(true);
    }
  }, [value]);

  return (
    <div className="relative z-10 w-full">
      <textarea
        value={value}
        onChange={(e) => { onChange(e.target.value) }}
        className={`${customClasses || ""} ${heightClass} form-text-area z-20 ${showPlaceholder ? "bg-transparent" : "bg-white" }`}>
      </textarea>
      <div className={`absolute overflow-hidden top-0 left-0 py-2 px-3 w-full ${heightClass} text-gray-400 rounded-md -z-10`}>
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

