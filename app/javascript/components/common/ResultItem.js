import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CopyButton from './CopyButton';
import LanguageToggle from './LanguageToggle';

const ResultItem = ({ result }) => {
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    if (translationPresent())
      setShowTranslation(true);
  }, [])

  const tags = (result) => {
    let text = "";
    if (result.prompt_labels && result.prompt_labels.length > 0) {
      text = `Tags: ${result.prompt_labels}`;
    }
    return (
      <p className="text-xs font-medium text-gray-500">{text}</p>
    )
  }

  const translationPresent = () => {
    return (
      result.translations &&
      result.translations.length > 0
    )
  }

  const trim = (text) => {
    return text ? text.trim() : "";
  }

  const resultObj = showTranslation ? result.translations[0] : result;
  const trimmedResult = trim(resultObj.result_text);

  if (trimmedResult !== "") {
    return (
      <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
        <p>{trimmedResult}</p>
        <br />
        <div className="flex justify-between items-center">
          {tags(result)}
          <div className="flex justify-center">
            <LanguageToggle
              translations={result.translations}
              showTranslation={showTranslation}
              toggleVisible={() => { setShowTranslation(!showTranslation) }}
            />
            <CopyButton result={result} copyText={trimmedResult} />
          </div>
        </div>
     </div>
    )
  } else {
    return null;
  }
}

export default ResultItem;
