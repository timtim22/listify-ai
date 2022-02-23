import React, { useState } from 'react';
import { useScrollToTopOnError } from '../hooks';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Submit from '../inputs/Submit';

const maxInput = 1500;

const Form = ({ onResult, loading, setLoading, promptSets }) => {
  const [playgroundAttempt, setPlaygroundAttempt] = useState({ request_type: promptSets[0].request_type, input_text: '' });
  const [errors, setErrors] = useState(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);

  const onError = useScrollToTopOnError(errors);

  const setField = (field, value) => {
    setPlaygroundAttempt({ ...playgroundAttempt, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    onResult(response);
  }

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    createRequest(
      "/playground_attempts.json",
      playgroundAttempt,
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )

  }

  const promptSelector = () => {
    return (
      <div className="mt-8 w-1/2">
        <label>Prompt set</label>
        <select
          onChange={(e) => setField('request_type',e.target.value)}
          className="form-select">
          {promptSets.map((item) => {
            return (
              <option key={item.request_type} value={item.request_type}>{item.request_type}</option>
            )
          })}
        </select>
      </div>
    )
  }

  const promptItem = (prompt) => {
    const keys = Object.keys(prompt).filter(k => !(["id", "position"].includes(k)))
    const string = keys.map(k => `${k}: ${prompt[k]}`).join(", ")
    return (
      <div key={prompt.id} className="pb-4 text-xs text-gray-500">
        <p>{prompt.position}. {string}</p>
      </div>
    )
  }

  const promptDetails = () => {
    if (showPromptDetails) {
      let prompts = promptSets.find(s => s.request_type === playgroundAttempt.request_type).prompts;
      return (
        <div className="py-4 w-4/5">
          <h3 className="mb-4 text-sm font-medium text-gray-500">Prompts</h3>
          {prompts.map(p => promptItem(p))}
       </div>
      )
    }
  }

  const toggleDetailsButton = () => {
    return (
      <button type="button" onClick={() => setShowPromptDetails(!showPromptDetails)} className="text-xs mt-4 secondary-link">
        {showPromptDetails? "Hide" : "Show"} prompt details
      </button>
    )
  }

  return (
    <form className="w-full h-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center w-full">
        <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Playground</h1>
        <p className="text-sm">A place to test prompt sets without impacting users.</p>
        {promptSelector()}
        {promptDetails()}
        {toggleDetailsButton()}
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          <label className="block mt-4 w-full">
            <span className="text-sm font-bold tracking-wider text-gray-500 uppercase">
              Text
            </span>
            <textarea
              value={playgroundAttempt.input_text}
              onChange={(e) => {setField('input_text', e.target.value)}}
              placeholder=""
              className="h-48 form-text-area">
            </textarea>
          </label>
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={playgroundAttempt.input_text}
              userInputLength={playgroundAttempt.input_text.length}
              maxUserInput={maxInput}
              loading={loading}
              runsRemaining={20}
            />
          </div>
        </div>
      </div>
    </form>
  )
}

export default Form;


