import React from 'react';
import PropTypes from 'prop-types';
import OyoOne from './OyoOne.js';
import OyoTwo from './OyoTwo.js';
import OyoThree from './OyoThree.js';
import MultiStepForm from '../common/MultiStepForm';

const Oyo = ({ loading, setLoading, runsRemaining, onResult, resetState }) => {

  return (
    <div>
      <MultiStepForm
        loading={loading}
        setLoading={setLoading}
        onResult={onResult}
        resetState={resetState}
      >
        <OyoOne
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
        />
        <OyoTwo
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
        />
        <OyoThree
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
        />
      </MultiStepForm>
    </div>
  )
};

Oyo.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
  resetState: PropTypes.func,
  runsRemaining: PropTypes.number
}

export default Oyo;
