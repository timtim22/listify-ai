import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shortcutsForField } from '../../helpers/textShortcuts';
import { createRequest, updateRequest, deleteRequest } from '../../helpers/requests';
import ProfanityWrapper from '../common/ProfanityWrapper';
import ErrorNotice from '../common/ErrorNotice';
import Notice from '../common/Notice';

const FORM_OPTIONS = ['Listing / Listing Builder']
const FIELD_OPTIONS = [
  { name: 'Property Type', value: 'property_type' },
  { name: 'Location', value: 'location' },
  { name: 'Ideal for', value: 'ideal_for' },
  { name: 'Key features', value: 'key_features' },
]

const ShortcutSettings = ({ persistedShortcuts }) => {
  const [shortcuts, setShortcuts] = useState(persistedShortcuts);
  const [errors, setErrors] = useState(null);
  const [notice,setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(FORM_OPTIONS[0].value);
  const [field, setField] = useState(FIELD_OPTIONS[0].value);
  const [shortcutInView, setShortcutInView] = useState(null);

  useEffect(() => {
    const persistedShortcut = findShortcut();
    if (persistedShortcut) {
      setShortcutInView(persistedShortcut.controls.join(', '));
    } else {
      setShortcutInView(shortcutsForField(field).join(', '));
    }
  }, [field]);

  const findShortcut = () => {
    return shortcuts.find(s => s.field === field);
  };

  const updateShortcut = (updated) => {
    let nextShortcuts = shortcuts.filter(s => s.id !== updated.id);
    setShortcuts([ ...nextShortcuts, updated]);
    setChangeNotice();
  };

  const removeShortcutFromState = (id) => {
    setShortcuts(shortcuts.filter(s => s.id !== id))
    setShortcutInView(shortcutsForField(field).join(', '));
    setChangeNotice();
  }

  const clearNotices = () => {
    setLoading(true);
    setNotice(null);
    setErrors(null);
  };

  const setChangeNotice = () => {
    setNotice('Shortcuts updated!');
    setLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    clearNotices();
    const persistedShortcut = findShortcut();
    const controls = shortcutsAsArray();
    if (!persistedShortcut) {
      createRequest(
        `/text/shortcuts.json`,
        { field, controls },
        (response) => { setShortcuts([ ...shortcuts, response.data ]); setChangeNotice()},
        (e) => { setErrors(e); setLoading(false) }
      )
    } else {
      updateRequest(
        `/text/shortcuts/${persistedShortcut.id}.json`,
        { field, controls },
        (response) => updateShortcut(response.data),
        (e) => { setErrors(e); setLoading(false) }
      )
    }
  }

  const deleteShortcut = () => {
    clearNotices();
    const persistedShortcut = findShortcut();
    deleteRequest(
      `/text/shortcuts/${persistedShortcut.id}.json`,
      (res) => removeShortcutFromState(res.data.id),
      (e) => { setErrors(e); setLoading(false) }
    )
  };

  const shortcutsAsArray = () => {
    return shortcutInView.split(',').filter(s => s !== '').map(s => s.trim());
  };

  const formSelect = () => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">Form</label>
        <select
          onChange={(e) => setForm(e.target.value)}
          className="w-full form-select">
            {FORM_OPTIONS.map((item) => {
              return (
                <option key={item} value={item}>{item}</option>
              )
            })}
        </select>
      </div>
    )
  };

  const fieldSelect = () => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">Field</label>
        <select
          onChange={(e) => setField(e.target.value)}
          className="w-full form-select">
            {FIELD_OPTIONS.map((item) => {
              return (
                <option key={item.value} value={item.value}>{item.name}</option>
              )
            })}
        </select>
      </div>
    )
  };

  const shortcutsList = () => {
    return (
      <div className="w-full mb-6">
        <label className="form-label">Shortcuts</label>
        <input
          type="text"
          value={(shortcutInView && shortcutInView) || ''}
          onChange={(e) => setShortcutInView(e.target.value) }
          className="w-full form-text-input"></input>
      </div>
    )
  };

  const withinCharacterLimits = () => {
    return shortcutInView.length < 250 &&
      shortcutInView.split(',').every(s => s.length <= 50);
  };

  const characterWarning = () => {
    return (
      <div className="py-2 h-16 flex items-center">
        <p className="text-sm font-semibold text-center text-red-800">
          Oops! One of your shortcuts is too long, or you have too many. Contact us if you'd like the limit increased.
        </p>
      </div>
    )
  };

  const resetButton = () => {
    const persistedShortcut = findShortcut();
    if (persistedShortcut && persistedShortcut.controls !== shortcutsForField(field)) {
      return (
        <button
          type="button"
          className="secondary-link text-sm mt-8"
          onClick={deleteShortcut}
        >
          Reset field to Listify defaults
        </button>
      )
    }
  };

  const submitButton = () => {
    if (shortcutInView !== null) {
      if (withinCharacterLimits()) {
        const buttonStyle = (loading) ? 'disabled-primary-button' : 'primary-button';
        return (
          <ProfanityWrapper textToCheck={shortcutInView}>
            <div className="mt-4">
              <button className={buttonStyle} type="submit">Save</button>
            </div>
            {resetButton()}
          </ProfanityWrapper>
        )
      } else {
        return characterWarning();
      }
    }
  };

  return (
    <div className="p-8 bg-white w-full max-w-6xl rounded-lg border border-gray-300 shadow-sm">
      {notice && <Notice message={notice} />}
      <div className="mb-4">
        <h2 className="log-in-header">Shortcuts</h2>
        <div className="mt-4 mb-8 w-full h-px bg-gray-200"></div>
        <p className="mb-8">
          Configure your shortcut buttons to save time typing.
          <span className="text-red-800 font-medium"> Shortcuts should be separated by commas </span>
          and not more than 50 characters each. Changes will not be saved until you tap the save button.{` `}
          <a
            href="https://www.loom.com/share/65fdb17c1ddb42f39e7c7aac4cd081cb"
            target="_blank"
            rel="noreferrer"
            className="secondary-link underline"
          >
             Watch the demo video to see how this works.
          </a>
        </p>

        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
          <div className="text-sm">
            <ErrorNotice errors={errors} />
          </div>
          {formSelect()}
          {fieldSelect()}
          {shortcutsList()}
          {submitButton()}
        </form>
      </div>
    </div>
  )
};

ShortcutSettings.propTypes = {
  persistedShortcuts: PropTypes.array
}

export default ShortcutSettings;
