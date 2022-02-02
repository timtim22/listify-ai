import React from 'react';
import PropTypes from 'prop-types';
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


const Results = ({ runsRemaining, results, taskRun, onRerun, loading, setLoading }) => {

  const resultFragment = (results) => {
  }

  const resultItem = (result) => {
    const trimmedResult = (result.result_text || "").trim();

    if (trimmedResult !== "") {
      return (
        <div key={result.id} className="flex h-full items-stretch pt-4">
          <div>
            <p className="text-sm whitespace-pre-wrap">{trimmedResult}</p>
          </div>
          <div className="pl-4 flex items-start flex-shrink-0">
            <FragmentRefreshButton
              taskRunId={result.task_run_id}
              runsRemaining={runsRemaining}
              onResult={onRerun}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      )
    } else {
      return null;
    }
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

  const copyText = (visibleResults) => {
    console.log({ visibleResults })
    return visibleResults.map(r => (r.result_text || "").trim()).join("\n");
  }

  const resultsBar = (visibleResults) => {
    return (
      <div className="flex justify-between items-center h-10">
        <p className="text-sm text-gray-500">{loading ? "Generating..." : ""}</p>
        <div className="flex justify-center">
          <LanguageToggle
            languageVisible={'EN'}
            toggleVisible={(lang) => { fetchTranslation(lang) }}
          />
          <CopyButton result={visibleResults[0]} copyText={copyText(visibleResults)} />
        </div>
      </div>
    )
  }

  const mostRecentResults = (groupedResults) => {
    let results =  Object.keys(groupedResults).map((key) => {
      const orderedByDate = sortObjectsByDate(groupedResults[key]);
      return orderedByDate[orderedByDate.length-1];
    });
    console.log({results})
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

