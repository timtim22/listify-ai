import React, { useState } from 'react';
import Sykes from './Sykes';
import VacasaOne from './VacasaOne';
import Kf from './Kf';

const availableForms = ['sykes_test', 'vacasa_one', 'kf'];

const Form = (props) => {
  const [formType, setFormType] = useState(availableForms[0]);

  const selectField = (title, field, options) => {
    return (
      <div className="flex justify-start items-center my-2 w-full">
        <label className="flex-shrink-0 w-1/3">{title}</label>
        <select
          value={formType}
          onChange={(e) => {setFormType(e.target.value)}}
          className="mx-3 mt-1 text-sm form-select">
            {options.map((item) => {
              return (
                <option key={item} value={item}>{item}</option>
              )
            })}
        </select>
      </div>
    )
  };

  const formInView = () => {
    if (formType === 'sykes_test') {
      return <Sykes {...props}/>;
    } else if (formType === 'vacasa_one') {
      return <VacasaOne {...props} />;
    } else {
      return <Kf {...props}/>;
    }
  };

  return (
    <div className="flex flex-col items-center w-full text-sm">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col w-4/5 max-w-2xl">
          {selectField('Form', 'form_type', availableForms)}
          {formInView()}
        </div>
      </div>
    </div>
  )
};

export default Form;
