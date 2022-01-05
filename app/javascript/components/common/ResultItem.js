import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import CopyButton from './CopyButton';
import LanguageToggle from './LanguageToggle';

const ResultItem = ({ result }) => {
  const [translations, setTranslations] = useState([]);
  const [languageVisible, setLanguageVisible] = useState("EN");
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (initialTranslationPresent()) {
      setTranslations(result.translations);
      setLanguageVisible(result.translations[0].to);
    }
  }, [])

  const initialTranslationPresent = () => {
    return (result.translations && result.translations.length > 0);
  }

  const fetchedLanguages = () => {
    return [ "EN", ...translations.map(t => t.to) ];
  }

  const handleRequestSuccess = (response) => {
    setTranslations([ ...translations, response.data ]);
    setErrors(null);
  }

  const fetchTranslation = (languageCode) => {
    setLanguageVisible(languageCode);
    if (!(fetchedLanguages().includes(languageCode))) {
        createRequest(
        "/translations.json",
          { translation: {
            object_id: result.id,
            object_type: result.object_type || "TaskResult",
            language: languageCode
          } },
        (response) => { handleRequestSuccess(response) },
        (e) => { setErrors(e); }
      )
    }
  }

  const visibleResult = () => {
    if (languageVisible === "EN") {
      return result;
    } else if (translations.map(t => t.to).includes(languageVisible)) {
      return translations.find(t => t.to === languageVisible);
    } else {
      return { result_text: "Fetching...", to: languageVisible }
    }
  }

  const tags = (result) => {
    let text = "";
    if (result.prompt_labels && result.prompt_labels.length > 0) {
      text = `Tags: ${result.prompt_labels}`;
    }
    return (
      <div className="flex items-end pb-2 h-full">
        <p className="text-xs font-medium text-gray-500">{text}</p>
      </div>
    )
  }

  const trimmedResult = (visibleResult().result_text || "").trim();

  if (trimmedResult !== "") {
    return (
      <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
        <p className="whitespace-pre-wrap text-sm">{trimmedResult}</p>
        <br />
        <div className="flex justify-between items-center h-10">
          {tags(result)}
          <div className="flex justify-center">
            <LanguageToggle
              languageVisible={languageVisible}
              toggleVisible={(lang) => { fetchTranslation(lang) }}
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
