import React from 'react';
import PropTypes from 'prop-types';
import ButtonPill from '../common/ButtonPill';

const shortcutButton = ({ name, targetField, setField }) => {

  const updateField = () => {
    const element = document.getElementById(targetField.name);
    if (element) {
      const text = element.value;
      let newText;
      if (element.nodeName.toLowerCase() === 'textarea') {
        newText = textForTextArea(text);
      } else {
        newText = textForInput(text);
      }
      if (!targetField.characterLimit || newText.length < targetField.characterLimit) {
        setField(element.id, newText);
      }
      element.focus();
    }
  };

  const textForInput = (text) => {
    if (['property_type', 'location'].includes(targetField.name)) {
      return name;
    } else if (text !== '') {
      const withoutName = textWithoutName(text, name);
      return  withoutName === '' ? name : withoutName + ', ' + name;
    } else {
      return text + name;
    }
  };

  const textWithoutName = (text, name) => {
    return text.trim().split(', ').filter(v => v !== name).join(', ')
  };

  const textForTextArea = (originalText) => {
    if (originalText === '') {
      return `- ${name}`
    } else {
      return originalText + '\n- ' + name;
    }
  };

  return (
    <ButtonPill
      key={name}
      name={name}
      onClick={() => updateField()}
    />
  )
};

shortcutButton.propTypes = {
  name: PropTypes.string,
  targetField: PropTypes.object,
  setField: PropTypes.func,
}

export default shortcutButton;
