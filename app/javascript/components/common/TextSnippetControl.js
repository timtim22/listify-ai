import React from 'react';
import PropTypes from 'prop-types';
import ButtonPill from './ButtonPill';
import { snippetsForField } from '../../helpers/textSnippets';

  const customButton = (name, setField, targetField) => {

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

const TextSnippetControl = ({ setField, targetField }) => {
  const snippets = snippetsForField(targetField.name);

  if (targetField.name) {
    return (
      <div className="fixed left-4 bottom-16 hidden lg:flex w-full lg:w-1/2 h-32 items-center justify-center pr-8">
        <div className="w-full max-w-2xl h-full p-4 border border-gray-300 text-center rounded-md bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg firefox-no-opacity overflow-scroll">
          <div className="w-full flex items-center mb-4">
            <div className="w-1/4"></div>
            <div className="w-1/2">
              <h3 className="uppercase font-base tracking-wide text-gray-900">Text snippets</h3>
            </div>
            <div className="w-1/4 flex justify-end items-center"><p className="text-xs secondary-link">Edit</p></div>
          </div>
          {snippets.map(name => customButton(name, setField, targetField))}
        </div>
      </div>
    )
  } else {
    return null
  }
};

TextSnippetControl.propTypes = {
  setField: PropTypes.func,
  targetField: PropTypes.object
}

export default TextSnippetControl;
