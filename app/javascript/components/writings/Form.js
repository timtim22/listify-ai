import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createRequest, redirectOnSuccess } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import Spinner from '../common/Spinner';
import InputLengthWarning from '../common/InputLengthWarning';

const maxInput = 400;

const newWriting = {
  request_type: 'tidy_grammar',
  input_text: ''
}

const Form = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(newWriting);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (errors) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [errors])

  const setField = (field, value) => {
    setWriting({ ...writing, [field]: value });
  }

  const handleRequestSuccess = (response) => {
    setLoading(false);
    onResult(response);
  }

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    createRequest(
      "/writings.json",
      writing,
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )

  }

  const submitButton = () => {
    if (loading) { return <Spinner />; }
    if (writing.input_text.length > maxInput) {
      return (
        <InputLengthWarning
          input={writing.input_text}
          maxInput={maxInput}
        />
      )
    }
    return (
      <button className="py-2 px-6 text-sm tracking-wider text-white bg-green-600 rounded-full shadow-sm hover:bg-green-700">
        Generate!
      </button>
    )
  }

  return (
    <form className="w-full h-full" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center w-full">
        <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">Writing assistant</h1>
        <p className="text-sm">Enter your text for the writing assistant to tidy up.</p>
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
              value={writing.input_text}
              onChange={(e) => {setField('input_text', e.target.value)}}
              placeholder=""
              className="h-48 form-text-area">
            </textarea>
          </label>
          <div className="flex justify-center py-8 w-full">
            {submitButton()}
          </div>
        </div>
      </div>
    </form>
  )
}

export default Form;


