import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import GeneratingSpinner from '../common/GeneratingSpinner';

const TaskRerunButton = ({ taskRun, runsRemaining, onResult, loading, setLoading, hideButton }) => {

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    createRequest(
      "/task_reruns.json",
      { task_run_id: taskRun.id },
      (response) => { onResult(response) },
      (e) => { console.log(e); setLoading(false) }
    )
  }

  if (loading) { return <GeneratingSpinner />; }
  if (hideButton) { return null; }
  if (runsRemaining < 1) { return null; }

  return (
    <button
      onClick={handleSubmit}
      className="py-2 px-6 text-sm tracking-wider text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700">
      Show more
    </button>
  )
}
export default TaskRerunButton;
