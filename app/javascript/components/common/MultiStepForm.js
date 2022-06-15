import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';

const Form = ({
  loading,
  onResult,
  resetState,
  children
}) => {
  const [step, setStep] = useState(0);

  const handleStepComplete = (response) => {
    onResult(response);
    setStep(step + 1);
  };

  const resetForm = () => {
    resetState();
    setStep(0);
  };


  const displayChild = (child, index) => {
     return (
      <Transition
        show={index === step || (index <= step && index === children.length -1)}
        enter="transition ease-linear transform duration-500"
        enterFrom="scale-25 opacity-0"
        enterTo="scale-100 opacity-100"
      >
        {React.cloneElement(child, { onResult: handleStepComplete })}
      </Transition>
     )
  };

  const resetBar = () => {
    if (step >= 1 && step <= children.length) {
      const cursorStyle = loading ? "cursor-not-allowed" : "cursor-pointer";
      return (
        <div className="w-full flex flex-col justify-center mb-4">
          <div className="mb-4 w-full h-px bg-gray-200"></div>
          <button
            disabled={loading}
            type="button"
            onClick={resetForm}
            className={`text-xs secondary-link ${cursorStyle} mt-4`}
          >
            Clear all sections and start again
          </button>
        </div>
      )
    }
  }

  return (
    <div className="overflow-hidden w-full">
      <div className="flex flex-col items-center pt-2 w-full h-full">
        <div className="flex flex-col items-center w-4/5 text-sm" >
          <div className="flex flex-col w-full max-w-2xl pb-4">
            {React.Children.map(children, (child, index) => displayChild(child, index))}
            {resetBar()}
          </div>
        </div>
      </div>
    </div>
  )
}

Form.propTypes = {
  loading: PropTypes.bool,
  onResult: PropTypes.func,
  resetState: PropTypes.func,
  children: PropTypes.array
}

export default Form;
