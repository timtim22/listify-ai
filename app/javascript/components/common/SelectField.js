import React, { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const SelectField = ({
  containerStyle,
  label,
  defaultValue,
  options,
  onChange,
  isSearchable,
  isClearable,
  isDisabled,
  isCreatable,
  isMulti
}) => {

  const formStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: '#e2e8f0'
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: '1rem',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem'
    })
  }

  const selectProps = {
    defaultValue,
    options,
    onChange: option => option ? onChange(option) : onChange({value: null}),
    styles: formStyles,
    isSearchable,
    isClearable,
    isDisabled,
    isCreatable,
    isMulti
  }

  const select = () => {
    if (isCreatable) {
      return <CreatableSelect { ...selectProps } />
    } else {
      return <Select { ...selectProps } />
    }
  }

  return (
    <div className={`field flex-grow ${containerStyle || ""}`}>
      <label>{label}</label>
      {select()}
    </div>
  )
}

export default SelectField;
