import React, { useState } from 'react';
import OyoOne from './OyoOne';
import OyoTwo from './OyoTwo';
import OyoThree from './OyoThree';

const formTypeOptions = [
  { name: 'Why stay here?', value: 'oyo_one' },
  { name: 'Things to do around', value: 'oyo_two' },
  { name: 'What to expect from the space', value: 'oyo_three' },
];


const Oyo = (props) => {
  const [formType, setFormType] = useState(formTypeOptions[0].value);

  const renderForm = () => {
    switch(formType) {
      case 'oyo_one':
        return <OyoOne {...props}/>
        break;
      case 'oyo_two':
        return <OyoTwo {...props}/>
        break;
      case 'oyo_three':
        return <OyoThree {...props}/>
        break;
    }
  };

  const selectField = (title, field, options) => {
    return (
      <div className="flex justify-start items-center my-2 w-full">
        <label className="flex-shrink-0 w-1/3">{title}</label>
        <select
          value={prompt[field]}
          onChange={(e) => {setFormType(e.target.value)}}
          className="mx-3 mt-1 text-sm form-select">
            {options.map((item) => {
              return (
                <option key={item.value} value={item.value}>{item.name}</option>
              )
            })}
        </select>
      </div>
    )
  };

  return (
    <div className="flex flex-col items-center w-full text-sm">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col w-4/5 max-w-2xl">
          {selectField('Form', 'form_type', formTypeOptions)}
          {renderForm()}
        </div>
      </div>
    </div>
  )
};

export default Oyo;
