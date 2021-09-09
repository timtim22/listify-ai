import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';

const newFeedback = { score: 0, comment: '' };

const FeedbackForm = ({ taskRunId }) => {
  const [feedback, setFeedback] = useState(newFeedback);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) { resetForm(); }
  }, [taskRunId])

  const resetForm = () => {
    setCompleted(false);
    setFeedback(newFeedback);
  }

  const setField = (field, value) => {
    setFeedback({ ...feedback, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setLoading(false);
    setCompleted(true);
  }

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const task_run_feedback = { ...feedback, task_run_id: taskRunId };
    createRequest(
      `/task_run_feedbacks.json`,
      task_run_feedback,
      (response) => { handleRequestSuccess(response) },
      (e) => { console.log(e) }
    )
  }

  const star = (index) => {
    let starType = 'far';
    if (feedback.score >= index) { starType = 'fas' };
    return (
      <i
        key={index}
        className={`${starType} fa-star cursor-pointer`}
        onClick={() => setField('score', index)}>
      </i>
    )
  }

  const stars = () => {
    const starsArray = [1,2,3,4,5].map((i) => { return star(i) });
    return starsArray;
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center py-3 px-4 mt-8 w-4/5 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm">Feedback submitted, thank you!</p>
      </div>
    )
  } else {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col py-3 px-4 mt-8 w-4/5 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="tracking-wider text-gray-700">How did we do?</span>
          <div className="flex justify-start items-center text-yellow-400">
            {stars()}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-700">Leave a comment (optional):</span>
          <div className="px-4 w-full">
            <input
              type="text"
              value={feedback.comment}
              onChange={(e) => {setField('comment', e.target.value)}}
              className="block px-2 mt-0 w-full border-0 border border-gray-200 focus:border-gray-300 focus:ring-0">
            </input>
          </div>
          <button className="add-button">Submit</button>

        </div>
      </form>
    )
  }
}

export default FeedbackForm;
