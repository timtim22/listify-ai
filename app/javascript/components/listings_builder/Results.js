import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import { groupBy, sortObjectsByDate } from '../../helpers/utils';
import RequestCounter from '../common/RequestCounter';
import NoResultsContent from '../common/NoResultsContent';
import GeneratingSpinner from '../common/GeneratingSpinner';
import FragmentRefreshButton from './FragmentRefreshButton';
import FragmentResult from './FragmentResult';
import CopyButton from '../common/CopyButton';
import LanguageToggle from '../common/LanguageToggle';

const english = "EN";
const fragmentOrder = ["summary_fragment", "bedroom_fragment_step_2", "other_room_fragment_step_2"];

const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {
  const [translations, setTranslations] = useState({});
  const [languageVisible, setLanguageVisible] = useState(english);
  const [errors, setErrors] = useState(null);
  const [resultsByRequestType, setResultsByRequestType] = useState({});
  const [visibleResultIndexes, setVisibleResultIndexes] = useState({});

  useEffect(() => {
    if (results.length > 0) { groupResultsByType() }
    if (languageVisible !== english) { setLanguageVisible(english) }
    if (Object.keys(translations).length > 0) { setTranslations({}) }
  }, [results]);

  useEffect(() => { setVisibleResults() }, [resultsByRequestType]);

  const setVisibleResults = () => {
    if (Object.keys(resultsByRequestType).length > 0) {
      const orderedByTime   = sortObjectsByDate(results);
      const lastRequestType = orderedByTime[orderedByTime.length -1].request_type
      const resultsCount    = resultsByRequestType[lastRequestType].length;

      setVisibleResultIndexes({
        ...visibleResultIndexes,
        [lastRequestType]: resultsCount - 1
      });
    }
  };

  const groupResultsByType = () => {
    const orderedByTime = sortObjectsByDate(results);
    const groupedResults = groupBy(orderedByTime, 'request_type');
    setResultsByRequestType(groupedResults);
  }

  const shouldShowPreviousButton = (requestType) => {
    return otherResultsForFragment(requestType) &&
      languageVisible === english;
  };

  const otherResultsForFragment = (requestType) => {
    return resultsByRequestType[requestType].length > 1;
  };

  const resultsToDisplay = () => {
    return Object.keys(visibleResultIndexes).length > 0;
  };

  const showPreviousResult = (requestType) => {
    const currentResultIndex = visibleResultIndexes[requestType];
    if (currentResultIndex === 0) {
      const lastResultIndex = resultsByRequestType[requestType].length - 1;
      setVisibleResultIndexes({
        ...visibleResultIndexes,
        [requestType]: lastResultIndex
      });
    } else {
      setVisibleResultIndexes({
        ...visibleResultIndexes,
        [requestType]: currentResultIndex - 1
      });
    }
  };

  const resultTextInCurrentLanguage = (result) => {
    if (languageVisible !== english && translations[result.id] &&
      translations[result.id][languageVisible]) {
      return translations[result.id][languageVisible];
    } else {
      return result.result_text;
    }
  }

  const handleTranslationRequestSuccess = (response) => {
    let nextTranslations = { ...translations };
    response.translations.map((translation) => {
      const resultId = translation.translatable_id;
      if (nextTranslations[resultId]) {
        nextTranslations[resultId][response.language] = translation.result_text;
      } else {
        nextTranslations[resultId] = { [response.language]: translation.result_text }
      }
    });
    setTranslations({ ...nextTranslations });
    setLoading(false);
    setErrors(null);
  }

  const shouldTranslate = (languageCode, results) => {
    return languageCode !== english &&
    !(results.every(r => translationPresentFor(r, languageCode)));
  }

  const translationPresentFor = (result, languageCode) => {
    return translations[result.id] &&
    Object.keys(translations[result.id]).includes(languageCode);
  }

  const fetchTranslations = (languageCode, visibleResults) => {
    setLanguageVisible(languageCode);
    if (shouldTranslate(languageCode, visibleResults)) {
      setLoading(true);
      createRequest(
        "/translations/create_batch.json",
        {
          object_ids: visibleResults.map(r => r.id),
          object_type: "TaskResult",
          language: languageCode
        },
        (response) => { handleTranslationRequestSuccess(response.data) },
        (e) => { setLoading(false); setErrors(e); }
      )
    }
  }

  const displayableText = (result) => {
    const inCurrentLanguage = resultTextInCurrentLanguage(result);
    return (inCurrentLanguage || "").trim();
  }

  const copyText = (visibleResults) => {
    return visibleResults.map((result) => {
      return displayableText(result)
    }).join("\n");
  }

  const resultsBar = (visibleResults) => {
    return (
      <div className="flex justify-between items-center h-10">
        <p className="text-sm text-gray-500">{loading ? "Generating..." : ""}</p>
        {resultActionButtons(visibleResults)}
     </div>
    )
  }

  const resultActionButtons = (visibleResults) => {
    if (visibleResults.length > 2) {
      return (
        <div className="flex justify-center">
          <LanguageToggle
            languageVisible={languageVisible}
            toggleVisible={(lang) => { fetchTranslations(lang, visibleResults) }}
          />
          <CopyButton result={visibleResults[0]} copyText={copyText(visibleResults)} />
        </div>
      )
    } else {
      return <div></div>
    }
  }

  const selectVisibleResults = () => {
    let visible = [];
    fragmentOrder.forEach((key) => {
      if (resultsByRequestType[key] && typeof(visibleResultIndexes[key]) === 'number') {
        const index = visibleResultIndexes[key];
        visible.push(resultsByRequestType[key][index]);
      }
    });
    return visible;
  };

  const showFragment = (result) => {
    return (
      <FragmentResult
        key={result.id}
        result={result}
        showPreviousResult={showPreviousResult}
        formatText={displayableText}
        shouldShowPreviousButton={shouldShowPreviousButton(result.request_type)}
        refreshButton={refreshButton(result)}
      />
    )
  };

  const refreshButton = (result) => {
    if (languageVisible === english) {
      return (
        <FragmentRefreshButton
          taskRunId={result.task_run_id}
          runsRemaining={runsRemaining}
          onResult={onRerun}
          loading={loading}
          setLoading={setLoading}
        />
      )
    }
  };

  if (resultsToDisplay()) {
    const visibleResults = selectVisibleResults();
    return (
      <div className="w-full h-full">
        <div className="flex flex-col items-center mb-4 w-full">
          <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Results</h1>
          <div className="flex flex-col items-center py-4 w-full">
            <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
              {visibleResults.map(result => showFragment(result))}
              <div className="pt-8">
                {resultsBar(visibleResults)}
              </div>
            </div>
            <RequestCounter runsRemaining={runsRemaining} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <NoResultsContent visible={!loading} />
        {loading && <div className="py-32"><GeneratingSpinner /></div>}
      </>
    )
  }
}

Results.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  results: PropTypes.array,
  runsRemaining: PropTypes.number,
  taskRun: PropTypes.object,
  onRerun: PropTypes.func
};

export default Results;
