import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import GeneratingSpinner from '../common/GeneratingSpinner';

const TaskRerunButton = ({ taskRun, onResult, loading, setLoading }) => {

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
  return (
    <button
      onClick={handleSubmit}
      className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
      Show more
    </button>
  )
}
export default TaskRerunButton;
