import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest, updateRequest, redirectOnSuccess } from '../../helpers/requests';
import { customInputs, customInputFieldKeys } from '../../helpers/customInputStructures';
import ErrorNotice from '../common/ErrorNotice';

const ruleTypes = ['keywords_match'];

const Form = ({
  actionType,
  ruleProps,
}) => {
  const [rule, setRule] = useState({
    ...ruleProps,
    rule_type: ruleProps.rule_type || ruleTypes[0],
    applicable_fields: ruleProps.applicable_fields.join(', '),
    keywords: ruleProps.keywords.join(', '),
  });
  const [inputStructure, setInputStructure] = useState(rule.input_structure || customInputs[0]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (validApplicableFields()) {
      setErrors(null);
      submitForm();
    } else {
      setErrors({ message: 'Unexpected value in applicable fields - it might just be a space missing between names' })
    }
  }

  const validApplicableFields = () => {
    const selectedFields = rule.applicable_fields.split(', ');
    return (
      selectedFields.every(f => customInputFieldKeys(inputStructure).includes(f))
    )
  };

  const submitForm = () => {
    if (actionType === 'new') {
      createRequest(
        `/admin/taggers/rules.json`,
        {
          rule: {
          ...rule,
          applicable_fields: rule.applicable_fields.split(', '),
          keywords: rule.keywords.split(', '),
          input_structure: inputStructure
          }
        },
        redirectOnSuccess,
        (e) => { console.log(e); setErrors(e); setLoading(false) }
      )
    } else {
      updateRequest(
        `/admin/taggers/rules/${ruleProps.id}.json`,
        {
          rule: {
          ...rule,
          applicable_fields: rule.applicable_fields.split(', '),
          keywords: rule.keywords.split(', '),
          input_structure: inputStructure
          }
        },
        redirectOnSuccess,
        (e) => { setErrors(e); setLoading(false) }
      )
    }
  };

  const setField = (field, value) => {
    setRule({ ...rule, [field]: value });
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

  const selectField = (title, field, options) => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">{title}</label>
        <select
          value={rule[field] || ruleTypes[0]}
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

  const textField = (title, field) => {
    return (
      <div key={field} className="w-full mb-6">
        <label className="form-label">{title}</label>
        <input
          type="text"
          value={rule[field] || ''}
          onChange={(e) => {setField(field, e.target.value)}}
          className="w-full form-text-input"></input>
      </div>
    )
  };

  return (
    <div className="w-full px-20 my-4">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-full text-sm">
          <ErrorNotice errors={errors} />
        </div>
        {inputStructureToggle()}
        {selectField('Rule Type', 'rule_type', ruleTypes)}
        {textField('Tag', 'tag')}
        {textField('Keywords', 'keywords')}
        {textField('Applicable fields', 'applicable_fields')}
        <div className="w-full text-left text-sm">
          <p>Applicable fields and keywords are comma separated lists.</p>
          <p>Applicable fields can be:
            <span className="font-medium"> {customInputFieldKeys(inputStructure).join(', ')}</span>
          </p>
        </div>
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
  ruleProps: PropTypes.object,
}

export default Form;
