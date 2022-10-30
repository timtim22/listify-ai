import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TextareaWithPlaceholder = ({ value, textAreaId, onChange, onFocus, placeholderContent, onKeyPress, customClasses, heightClass = "h-32" }) => {
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
        id={textAreaId}
        value={value}
        onKeyPress={(e) => { onKeyPress(e) }}
        onChange={(e) => { onChange(e.target.value) }}
        onFocus={onFocus}
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
  textAreaId: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  placeholderContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  customClasses: PropTypes.string,
  heightClass: PropTypes.string,
  handleMessageBox:PropTypes.string
};


export default TextareaWithPlaceholder;

