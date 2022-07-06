import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sykes from '../custom_forms/Sykes';
import VacasaOne from '../custom_forms/VacasaOne';
import VacasaTwo from '../custom_forms/VacasaTwo';
import VacasaThree from '../custom_forms/VacasaThree';
import Kf from '../custom_forms/Kf';
import OyoOne from '../custom_forms/OyoOne';
import OyoTwo from '../custom_forms/OyoTwo';
import OyoThree from '../custom_forms/OyoThree';

const availableForms = ['kf', 'sykes_test', 'vacasa_one', 'vacasa_two', 'vacasa_three', 'oyo_one', 'oyo_two', 'oyo_three'];

const Form = ({ onResult, loading, setLoading }) => {
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
    const formProps = {
      loading: loading,
      setLoading: setLoading,
      onResult: onResult,
      runsRemaining: 20
    }

    if (formType === 'sykes_test') {
      return <Sykes {...formProps}/>;
    } else if (formType === 'oyo_one') {
      return <OyoOne {...formProps } />;
    } else if (formType === 'oyo_two') {
      return <OyoTwo {...formProps } />;
    } else if (formType === 'oyo_three') {
      return <OyoThree {...formProps } />;
    } else if (formType === 'vacasa_one') {
      return <VacasaOne {...formProps} />;
   } else if (formType === 'vacasa_two') {
      return <VacasaTwo {...formProps} />;
  } else if (formType === 'vacasa_three') {
    return <VacasaThree {...formProps} />;
    } else {
      return <Kf {...formProps}/>;
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center w-full">
        <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Test Form</h1>
        <p className="text-sm">Test and demo new forms.</p>
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
      </div>
      <div className="flex flex-col items-center w-full text-sm">
        <div className="flex flex-col w-4/5 max-w-2xl">
          {selectField('Form', 'form_type', availableForms)}
          {formInView()}
        </div>
      </div>
    </div>
  )
}

Form.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
}

export default Form;


