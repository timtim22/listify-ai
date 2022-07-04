import React from 'react';
import PropTypes from 'prop-types';
import VacasaOne from './VacasaOne.js';
import VacasaTwo from './VacasaTwo.js';
import VacasaThree from './VacasaThree.js';
import MultiStepForm from '../common/MultiStepForm';

const Vacasa = ({ loading, setLoading, runsRemaining, onResult, resetState }) => {

  return (
    <div>
      <MultiStepForm
        loading={loading}
        setLoading={setLoading}
        onResult={onResult}
        resetState={resetState}
      >
        <VacasaOne
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
        />
        <VacasaTwo
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
        />
        <VacasaThree
          loading={loading}
          setLoading={setLoading}
          runsRemaining={runsRemaining}
        />
      </MultiStepForm>
    </div>
  )
};

Vacasa.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  onResult: PropTypes.func,
  resetState: PropTypes.func,
  runsRemaining: PropTypes.number
}

export default Vacasa;

