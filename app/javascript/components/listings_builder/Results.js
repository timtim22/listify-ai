import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ResultList from '../common/ResultList';
import RequestCounter from '../common/RequestCounter';
import NoResultsContent from '../common/NoResultsContent';
import GeneratingSpinner from '../common/GeneratingSpinner';
import FragmentRefreshButton from './FragmentRefreshButton';
import CopyButton from '../common/CopyButton';
import LanguageToggle from '../common/LanguageToggle';

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const sortObjectsByDate = (array) => {
  return array.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
  });
}

const english = "EN";

const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {
  const [translations, setTranslations] = useState({});
  const [languageVisible, setLanguageVisible] = useState(english);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (languageVisible !== english) { setLanguageVisible(english) }
    if (Object.keys(translations).length > 0) { setTranslations({}) }
  }, [results]);

  const resultItem = (result) => {
    const displayText = displayableText(result);

    if (displayText !== "") {
      return (
        <div key={result.id} className="flex h-full items-stretch pt-4">
          <div>
            <p className="text-sm whitespace-pre-wrap">{displayText}</p>
          </div>
          <div className="pl-4 flex items-start flex-shrink-0">
            {refreshButton(result)}
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  const displayableText = (result) => {
    const inCurrentLanguage = resultTextInCurrentLanguage(result);
    return (inCurrentLanguage || "").trim();
  }

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
    } else {
      return null;
    }
  }

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

  const mostRecentResults = (groupedResults) => {
    let results =  Object.keys(groupedResults).map((key) => {
      const orderedByDate = sortObjectsByDate(groupedResults[key]);
      return orderedByDate[orderedByDate.length-1];
    });
    return results;
  }


  if (results.length > 0) {
    const groupedResults = groupBy(results, 'request_type');
    const visibleResults = mostRecentResults(groupedResults);
    return (
      <div className="w-full h-full">
        <div className="flex flex-col items-center mb-4 w-full">
          <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Results</h1>
          <div className="flex flex-col items-center py-4 w-full">
            <div className="py-3 px-4 mb-4 w-4/5 rounded-lg border border-gray-200">
              {visibleResults.map(result => resultItem(result))}
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

export default Results;

