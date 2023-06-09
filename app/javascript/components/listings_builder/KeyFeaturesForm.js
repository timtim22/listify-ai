import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NumberField from '../common/NumberField';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import ShortcutPanel from '../text/ShortcutPanel';

const generalFeaturesPlaceholder = () => {
  return (
    <div className="flex flex-col items-start mb-px leading-relaxed">
      <p>- e.g. trendy neighbourhood</p>
      <p>- famous for nightlife</p>
      <p>- Great location for exploring the city</p>
    </div>
  )
}

const singleInputCharLimit = 60;
const textAreaCharLimit = 200;

const KeyFeaturesForm = ({
  inputFields,
  setField,
  setBedroomCount,
  handleSubmit,
  stepButton
  }) => {

  const [shortcutField, setShortcutField] = useState({});

  const setInputIfValid = (key, value, limit) => {
    if (value.length <= limit) {
      setField(key, value);
    }
  }

  const assembleHeadline = () => {
    const { bedroom_count, property_type, location, ideal_for, key_features } = inputFields;
    const first = `- ${bedroom_count} bedroom ${property_type} in ${location}\n`;
    const second = ideal_for.length > 3 ? `- ideal for ${ideal_for}\n` : "";
    return `${first}${second}${key_features}`
  }

  const bedroomsCountRow = () => {
    return (
      <NumberField
        title="Bedrooms"
        value={inputFields.bedroom_count}
        onChange={(v) => setBedroomCount(v)}
        minValue={1}
        maxValue={8}
      />
    )
  }

  const textInputRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm text-gray-800">{title}</label>
        <input
          id={key}
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => setInputIfValid(key, e.target.value, singleInputCharLimit)}
          onFocus={() => setShortcutField({ name: key, characterLimit: singleInputCharLimit })}
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const detailField = (title, fieldName, placeholder) => {
    const charsLeft = textAreaCharLimit - inputFields[fieldName].length;
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-start w-full">
          <label className="flex-shrink-0 mt-3 w-1/3 text-sm text-gray-700">{title}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              textAreaId={'key_features'}
              value={inputFields[fieldName]}
              onChange={(value) => setInputIfValid(fieldName, value, textAreaCharLimit)}
              onFocus={() => setShortcutField({ name: 'key_features', characterLimit: textAreaCharLimit })}
              heightClass={"h-32"}
              placeholderContent={placeholder()}
              customClasses={"text-sm"}
            />
          </div>
        </div>
        {characterCounter(charsLeft)}
     </div>
    )
  }

  const characterCounter = (charsLeft) => {
    const shouldShow = charsLeft <= 30;
    const style = charsLeft <= 10 ? "text-red-500" : "";
    return (
      <div className="self-end pt-2 pr-3 text-xs font-medium text-gray-500">
        {shouldShow && <p className={style}>{charsLeft}</p>}
      </div>
    )
  };

  return (
    <>
      <form className="pt-2" onSubmit={(e) => handleSubmit(e, assembleHeadline())}>
        <p className="mb-6 mt-2">Build your listing step-by-step, choosing the next section as you go. Text will appear in the results panel as you complete each section.</p>
        {textInputRow('Property type', 'property_type', 'e.g. apartment, house...', true)}
        {textInputRow('Location', 'location', '', true)}
        {textInputRow('Ideal for', 'ideal_for', 'e.g. families, couples', '', false)}
        {bedroomsCountRow()}
        {detailField('Key Features', 'key_features', generalFeaturesPlaceholder)}
        {stepButton()}
    </form>
      <ShortcutPanel
        setField={setField}
        targetField={shortcutField}
      />
    </>
  )
};

KeyFeaturesForm.propTypes = {
  inputFields: PropTypes.object,
  setField: PropTypes.func,
  setBedroomCount: PropTypes.func,
  handleSubmit: PropTypes.func,
  stepButton: PropTypes.func
}

export default KeyFeaturesForm;
