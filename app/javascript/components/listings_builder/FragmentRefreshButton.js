import React from 'react';
import { createRequest } from '../../helpers/requests';

const FragmentRefreshButton = ({ taskRunId, runsRemaining, onResult, loading, setLoading, hideButton }) => {

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    createRequest(
      "/task_reruns.json",
      { task_run_id: taskRunId },
      (response) => { onResult(response) },
      (e) => { console.log(e); setLoading(false) }
    )
  }

  const refreshIcon = () => {
    return (
      <svg width="16" height="16" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1.99993V6.99993H1.582M1.582 6.99993C2.24585 5.35806 3.43568 3.98284 4.96503 3.08979C6.49438 2.19674 8.2768 1.83634 10.033 2.06507C11.7891 2.29379 13.4198 3.09872 14.6694 4.3537C15.919 5.60869 16.7168 7.24279 16.938 8.99993M1.582 6.99993H6M17 17.9999V12.9999H16.419M16.419 12.9999C15.7542 14.6408 14.564 16.015 13.0348 16.9072C11.5056 17.7995 9.72374 18.1594 7.9681 17.9308C6.21246 17.7022 4.5822 16.8978 3.33253 15.6437C2.08287 14.3895 1.28435 12.7564 1.062 10.9999M16.419 12.9999H12" stroke="#2563EB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  if (hideButton) { return null; }
  if (runsRemaining < 1) { return null; }
  return (
    <>
      <button
        title="Refresh this text"
        disabled={loading}
        onClick={handleSubmit}
        className={`${loading ? "cursor-not-allowed opacity-50" : ""} flex justify-center items-center p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 active:bg-gray-200`}
      >
        {refreshIcon()}
      </button>
    </>
  )
}
export default FragmentRefreshButton;

