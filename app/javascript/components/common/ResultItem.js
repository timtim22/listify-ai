import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CopyButton from './CopyButton';
import LanguageToggle from './LanguageToggle';

const ResultItem = ({ result }) => {
  const [translations, setTranslations] = useState(result.translations);
  const [languageVisible, setLanguageVisible] = useState("EN");

  useEffect(() => {
    if (initialTranslationPresent())
      setLanguageVisible(result.translations[0].to);
  }, [])

  const tags = (result) => {
    let text = "";
    if (result.prompt_labels && result.prompt_labels.length > 0) {
      text = `Tags: ${result.prompt_labels}`;
    }
    return (
      <div className="h-full flex items-end pb-2">
        <p className="text-xs font-medium text-gray-500">{text}</p>
      </div>
    )
  }

  const initialTranslationPresent = () => {
    return (result.translations && result.translations.length > 0)
  }

  const trim = (text) => {
    return text ? text.trim() : "";
  }

  const resultObj = languageVisible === "EN" ? result : result.translations[0];
  const trimmedResult = trim(resultObj.result_text);

  if (trimmedResult !== "") {
    return (
      <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
        <p>{trimmedResult}</p>
        <br />
        <div className="h-10 flex justify-between items-center">
          {tags(result)}
          <div className="flex justify-center">
            <LanguageToggle
              translations={result.translations}
              languageVisible={languageVisible}
              toggleVisible={(lang) => { console.log(lang); setLanguageVisible(lang) }}
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
