import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollToTopOnError } from '../hooks';
import { createRequest, updateRequest, redirectOnSuccess } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';

const Form = ({
  actionType,
  promptProps,
  procedure,
  serviceOptions,
  serviceConstraints,
  engines
}) => {
  const [step_prompt, setPrompt] = useState(promptProps);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onError = useScrollToTopOnError(errors);

  useEffect(() => {
    const enginesForService = engines[step_prompt.service.toLowerCase()];
    if (!enginesForService.includes(step_prompt.engine)) {
      setPrompt({ ...step_prompt, engine: enginesForService[enginesForService.length-1]})
    }
  }, [step_prompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    if (actionType === 'new') {
      createRequest(
        `/admin/procedures/${procedure.id}/steps.json`,
        { step_prompt },
        redirectOnSuccess,
        (e) => { setErrors(e); setLoading(false) }
      )
    } else {
      updateRequest(
        `/admin/procedures/${procedure.id}/steps/${step_prompt.id}.json`,
        { step_prompt },
        redirectOnSuccess,
        (e) => { setErrors(e); setLoading(false) }
      )
    }
  }

  const setField = (field, value) => {
    setPrompt({ ...step_prompt, [field]: value });
  }

  const textArea = (title, field) => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">{title}</label>
        <textarea
          type="text"
          value={step_prompt[field] || ''}
          onChange={(e) => {setField(field, e.target.value)}}
          className="w-full h-48 form-text-area"></textarea>
      </div>
    )
  };

  const textField = (title, field) => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">{title}</label>
        <input
          type="text"
          value={step_prompt[field] || ''}
          onChange={(e) => {setField(field, e.target.value)}}
          className="w-full form-text-input"></input>
      </div>
    )
  };

  const numberField = (title, field, minValue, maxValue, step) => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">{title}</label>
        <input
          type="number"
          min={minValue || 0}
          max={maxValue}
          step={step || 1}
          value={step_prompt[field]}
          onChange={(e) => {setField(field, e.target.value)}}
          className="w-full form-text-input"></input>
      </div>
    )
  };

  const selectField = (title, field, options) => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">{title}</label>
        <select
          value={step_prompt[field]}
          onChange={(e) => {setField(field, e.target.value)}}
          className="w-full form-select">
            {options.map((item) => {
              return (
                <option key={item} value={item}>{item}</option>
              )
            })}
        </select>
      </div>
    )
  };

  const maxValue = (field) => {
    const constraints = serviceConstraints[step_prompt['service']];
    if (constraints && constraints[field] && constraints[field]['max']) {
      return constraints[field]['max'];
    } else {
      return 1.0;
    }
  };

  return (
    <div className="w-full px-20 my-4">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5 text-sm">
          <ErrorNotice errors={errors} />
        </div>
        {textField('Title', 'title')}
        {textArea('Content', 'content')}
        {textField('Stop (use \\n for newline)', 'stop')}
        {selectField('Service', 'service', serviceOptions)}
        <div className="w-full grid grid-cols-5 gap-2">
          {numberField('Temperature', 'temperature', 0.0, maxValue('temperature'), 0.05)}
          {numberField('Max tokens', 'max_tokens', 0, 250)}
          {numberField('Top p', 'top_p', 0.0, 1.0, 0.05)}
          {numberField('Frequency penalty', 'frequency_penalty', 0.0, maxValue('frequency_penalty'), 0.1)}
          {numberField('Presence penalty', 'presence_penalty', 0.0, 1.0, 0.1)}
        </div>
        {selectField('Engine (must be correct if using a trained AI21 model)', 'engine', engines[step_prompt['service'].toLowerCase()])}
        {textField('Remote finetuning model id (leave blank for none)', 'remote_model_id')}
        {textField("Labels (separate with commas, e.g. 'creative, short')", 'labels')}
        <div className="flex flex-col w-4/5 max-w-2xl">
          <div className="flex justify-center py-8 w-full">
            <button className="add-button" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  )
}

Form.propTypes = {
  actionType: PropTypes.string,
  promptProps: PropTypes.object,
  procedure: PropTypes.object,
  serviceOptions: PropTypes.array,
  serviceConstraints: PropTypes.object,
  engines: PropTypes.object
}

export default Form;
