import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../listings/New';
import { presetShortcuts } from '../../helpers/textShortcuts';
import { getRequest } from '../../helpers/requests';
import ShortcutButton from './ShortcutButton';

const ShortcutPanel = ({ setField, targetField }) => {
  const user = useContext(UserContext);

  const [shortcuts, setShortcuts] = useState({});
  const [errors, setErrors] = useState(null);

  const hasShortcutsEnabled = () => {
    return user.enabled_modules.includes('shortcuts');
  };

  useEffect(() => {
    if (hasShortcutsEnabled()) { fetchShortcuts() }
  }, []);

  const setShortcutsInState = (persistedShortcuts) => {
    let combinedShortcuts = {};
    persistedShortcuts.forEach(ps => combinedShortcuts[ps.field] = ps.controls);
    Object.keys(presetShortcuts).forEach(key => {
      if (!combinedShortcuts[key]) {
        combinedShortcuts[key] = presetShortcuts[key];
      }
    })
    setShortcuts(combinedShortcuts);
  }

  const fetchShortcuts = () => {
    getRequest(
      `/text/shortcuts.json`,
      (response) => setShortcutsInState(response.shortcuts),
      (err) => { setErrors(err) }
    )
  };

  const displayShortcuts = () => {
    if (errors) {
      return (
        <p className="text-red-800">
          Error fetching shortcuts. Please refresh the page or contact us if this keeps happening.
        </p>
      )
    } else if (shortcuts[targetField.name].length > 0) {
      return shortcuts[targetField.name].map((name) => {
        return (
          <ShortcutButton
            key={name}
            name={name}
            setField={setField}
            targetField={targetField}
          />
        )
      })
    } else {
      return <p>No shortcuts configured for this field.</p>
    }
  };

  if (hasShortcutsEnabled() && targetField.name) {
    return (
      <div className="fixed left-4 bottom-16 hidden lg:flex w-full lg:w-1/2 h-32 items-center justify-center pr-8">
        <div className="w-full max-w-2xl h-full p-4 border border-gray-300 text-center rounded-md bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg firefox-no-opacity overflow-scroll">
          <div className="w-full flex items-center mb-4">
            <div className="w-1/4"></div>
            <div className="w-1/2">
              <h3 className="uppercase font-base tracking-wide text-gray-900">Text shortcuts</h3>
            </div>
            <div className="w-1/4 flex justify-end items-center"><a href ="/text/shortcuts" className="text-xs secondary-link">Edit</a></div>
          </div>
          {displayShortcuts()}
        </div>
      </div>
    )
  } else {
    return null
  }
};

ShortcutPanel.propTypes = {
  setField: PropTypes.func,
  targetField: PropTypes.object
}

export default ShortcutPanel;
