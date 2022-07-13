import React from 'react';
import PropTypes from 'prop-types';
import ButtonPill from './ButtonPill';
import { snippetsForField } from '../../helpers/textSnippets';

  const customButton = (name, setField, currentField) => {

    const updateField = () => {
      const element = document.getElementById(currentField);
      if (element) {
        const text = element.value;
        let newText;
        if (element.nodeName.toLowerCase() === 'textarea') {
          newText = textForTextArea(text);
        } else {
          newText = textForInput(text);
        }
        setField(element.id, newText)
        element.focus();
      }
    };

    const textForInput = (text) => {
      if (['propertyType', 'location'].includes(currentField)) {
        return name;
      } else if (text !== '') {
        return text.trim() + ', ' + name;
      } else {
        return text + name;
      }
    };

    const textForTextArea = (originalText) => {
      let prefix = originalText === '' ? '- ' : '\n- ';
      return originalText + prefix + name;
    };

    return (
      <ButtonPill
        key={name}
        name={name}
        onClick={() => updateField()}
      />
    )
  };

const TextSnippetControl = ({ setField, currentField  }) => {
  const snippets = snippetsForField(currentField);

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
        {snippets.map(name => customButton(name, setField, currentField))}
      </div>
    </div>
  )
};

TextSnippetControl.propTypes = {
  setField: PropTypes.func,
  currentField: PropTypes.func
}

export default TextSnippetControl;
