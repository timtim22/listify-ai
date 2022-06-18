import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRequest, createRequest } from '../../helpers/requests';
import CopyButton from './CopyButton';
import LanguageToggle from './LanguageToggle';

const PlaygroundResultItem = ({ result }) => {
  const [translations, setTranslations] = useState([]);
  const [languageVisible, setLanguageVisible] = useState("EN");
  const [errors, setErrors] = useState(null);
  const [recordedCompletion, setRecordedCompletion] = useState(null);

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

  const fetchRecordedCompletion = () => {
    getRequest(
      `/admin/recorded_completions/${result.completion_id}`,
      (completion) => setRecordedCompletion(completion),
      (e) => console.log(e)
    )
  };

  const fetchOrClearCompletion = () => {
    recordedCompletion ? setRecordedCompletion(null) : fetchRecordedCompletion();
  };

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

  const requestInfo = (config) => {
    return Object.keys(config).map((k) => {
      return `${k}: ${config[k]}`
    }).join(', ')
  };

  const displayDebugInfo = () => {
    if (recordedCompletion) {
      return (
        <div className="text-xs">
          <h2 className="font-medium">Prompt</h2>
          <p>request_type: {recordedCompletion.request_type}</p>
          <p>api_client: {recordedCompletion.api_client}</p>
          <p>prompt_title: {recordedCompletion.prompt_title}</p>
          <p>engine: {recordedCompletion.engine}</p>
          <p>remote_model_id: {recordedCompletion.remote_model_id}</p>
          <p>request_configuration: {requestInfo(recordedCompletion.request_configuration)}</p>
          <br/>
          <p className="font-medium">prompt_text:</p>
          <p className="whitespace-pre-wrap">{recordedCompletion.prompt_text}</p>
          <br/>
          <p>-----</p>
          <h2 className="font-medium">Statuses</h2>
          <p>input_object_type: {recordedCompletion.input_object_type}</p>
          <p>result_error: <span className="text-red-700">{recordedCompletion.result_error}</span></p>
          <p>ran_content_filter: {recordedCompletion.ran_content_filter}</p>
          <p>failed_filter: {recordedCompletion.failed_filter}</p>
          <br/>
        </div>
      )
    }
  };

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

  const debugButton = () => {
    return (
      <button
        title="Debug"
        type="button"
        onClick={fetchOrClearCompletion}
        className="flex justify-center items-center uppercase text-xs font-medium px-2 bg-gray-50 text-red-900 rounded-lg border border-gray-200 hover:bg-gray-100 active:bg-gray-200"
      >
        Debug
      </button>
    )
  };

  const trimmedResult = (visibleResult().result_text || "").trim();

  if (trimmedResult !== "") {
    return (
      <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
        <p className="text-sm whitespace-pre-wrap">{trimmedResult}</p>
        <br />
        <div className="flex justify-between items-center h-10">
          {tags(result)}
          <div className="flex justify-center">
            {debugButton()}
            <LanguageToggle
              languageVisible={languageVisible}
              toggleVisible={(lang) => { fetchTranslation(lang) }}
            />
            <CopyButton result={result} copyText={trimmedResult} />
          </div>
        </div>
        {displayDebugInfo()}
     </div>
    )
  } else {
    return null;
  }
}

PlaygroundResultItem.propTypes = {
  result: PropTypes.object
}

export default PlaygroundResultItem;
