import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest, updateRequest, redirectOnSuccess } from '../../helpers/requests';
import { customInputFields, customInputs } from '../../helpers/customInputStructures';
import ErrorNotice from '../common/ErrorNotice';

const Form = ({
  actionType,
  exampleProps,
}) => {
  const [example, setExample] = useState(exampleProps);
  const [inputStructure, setInputStructure] = useState(example.input_structure || customInputs[0]);
  const [inputFields, setInputFields] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputStructure) { generateInputFields() }
  }, [inputStructure]);

  const generateInputFields = () => {
    const fields = customInputFields(inputStructure);
    const newData = {};
    fields.map((f) => {
      newData[f.key] = actionType === 'new' ? f.default : example.input_data[f.key];
    })
    setInputFields(fields);
    setField('input_data', newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    if (actionType === 'new') {
      createRequest(
        `/admin/examples.json`,
        { example: { ...example, input_structure: inputStructure } },
        redirectOnSuccess,
        (e) => { console.log(e); setErrors(e); setLoading(false) }
      )
    } else {
      updateRequest(
        `/admin/examples/${exampleProps.id}.json`,
        { example: { ...example, input_structure: inputStructure } },
        redirectOnSuccess,
        redirectOnSuccess,
        (e) => { setErrors(e); setLoading(false) }
      )
    }
  }

  const setField = (field, value) => {
    setExample({ ...example, [field]: value });
  }

  const setFieldInInputData = (field, value) => {
    const newData = { ...example.input_data, [field]: value };
    setField('input_data', newData);
  }

  const inputStructureToggle = () => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">Input Structure</label>
        <select
          disabled={actionType === 'edit'}
          value={inputStructure}
          onChange={(e) => setInputStructure(e.target.value)}
          className="w-full form-select">
            {customInputs.map((item) => {
              return (
                <option key={item} value={item}>{item}</option>
              )
            })}
        </select>
      </div>
    )
  }

  const requestField = () => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">Request type (usually should be the same as input structure)</label>
        <input
          type="text"
          value={example.request_type || ''}
          required={true}
          onChange={(e) => setField('request_type', e.target.value)}
          className="w-full form-text-input"></input>
      </div>
    )
  };

  const completionField = () => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">Completion</label>
        <textarea
          type="text"
          value={example.completion || ''}
          onChange={(e) => {setField('completion', e.target.value)}}
          required={true}
          className="w-full h-48 form-text-area"></textarea>
      </div>
    )
  };

  const textField = (title, field) => {
    return (
      <div key={field} className="w-full mb-6">
        <label className="form-label">{title}</label>
        <input
          type="text"
          value={example.input_data[field] || ''}
          onChange={(e) => {setFieldInInputData(field, e.target.value)}}
          className="w-full form-text-input"></input>
      </div>
    )
  };

  const textArea = (title, field) => {
    return (
      <div key={field} className="w-full mb-6">
        <label className="form-label">{title}</label>
        <textarea
          type="text"
          value={example.input_data[field] || ''}
          onChange={(e) => {setFieldInInputData(field, e.target.value)}}
          required={true}
          className="w-full h-32 form-text-area"></textarea>
      </div>
    )
  };

  const fieldsForInputStructure = () => {
    return inputFields.map((f) => {
      if (f.field_type === 'text') {
        return textArea(f.title, f.key);
      } else {
        return textField(f.title, f.key);
      }
    })
  };

  return (
    <div className="w-full px-20 my-4">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5 text-sm">
          <ErrorNotice errors={errors} />
        </div>
        {inputStructureToggle()}
        {requestField()}
        {fieldsForInputStructure()}
        {completionField('Completion', 'completion')}
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
  exampleProps: PropTypes.object,
}

export default Form;
