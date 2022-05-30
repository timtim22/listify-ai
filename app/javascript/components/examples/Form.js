import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest, updateRequest, redirectOnSuccess } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';

const exampleTypes = ['oyo_one', 'oyo_two'];
const inputFieldsFor = (inputStructure) => {
  const structures = {
    oyo_one: [
      { key: 'property_type', title: 'Property Type', type: 'string', default: '' },
      { key: 'target_user', title: 'Target user', type: 'string', default: '' },
      { key: 'location', title: 'location', type: 'string', default: '' },
      { key: 'location_detail', title: 'Location detail', type: 'string', default: '' },
      { key: 'usp_one', title: 'USP 1', type: 'string', default: '' },
      { key: 'usp_two', title: 'USP 2', type: 'string', default: '' },
      { key: 'usp_three', title: 'USP 3', type: 'string', default: '' },
    ],
    oyo_two: [
      { key: 'usp_one', title: 'USP 1', type: 'string', default: '' },
      { key: 'usp_two', title: 'USP 2', type: 'string', default: '' },
      { key: 'usp_three', title: 'USP 3', type: 'string', default: '' },
      { key: 'usp_four', title: 'USP 4', type: 'string', default: '' },
      { key: 'usp_five', title: 'USP 5', type: 'string', default: '' },
    ]
  }
  return structures[inputStructure];
}

const Form = ({
  actionType,
  exampleProps,
}) => {
  const [example, setExample] = useState(exampleProps);
  const [inputStructure, setInputStructure] = useState(example.input_structure || exampleTypes[0]);
  const [inputFields, setInputFields] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputStructure) { generateInputFields() }
  }, [inputStructure]);

  const generateInputFields = () => {
    const fields = inputFieldsFor(inputStructure);
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
            {exampleTypes.map((item) => {
              return (
                <option key={item} value={item}>{item}</option>
              )
            })}
        </select>
      </div>
    )
  }

  const textArea = (title, field) => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">{title}</label>
        <textarea
          type="text"
          value={example[field] || ''}
          onChange={(e) => {setField(field, e.target.value)}}
          required={true}
          className="w-full h-48 form-text-area"></textarea>
      </div>
    )
  };

  const requestField = () => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">Request type (usually should be the same as input structure)</label>
        <input
          type="text"
          value={example.request_type || ''}
          onChange={(e) => setField('request_type', e.target.value)}
          className="w-full form-text-input"></input>
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

  const fieldsForInputStructure = () => {
    return inputFields.map((f) => {
      return textField(f.title, f.key);
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
        {textArea('Completion', 'completion')}
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
