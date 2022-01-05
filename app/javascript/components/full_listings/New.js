import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import ResultList from '../common/ResultList';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import NumberField from '../common/NumberField';
import OtherRoomForm from '../rooms/OtherRoomForm';
import BedroomInput from '../rooms/BedroomInput';
import FullListingPoll from './FullListingPoll';
import Submit from '../inputs/Submit';
import RequestCounter from '../common/RequestCounter';

const newInputFields = {
  property_type: '',
  location: '',
  ideal_for: '',
  bedroom_count: 1,
  sleeps: 2,
  key_features: '',
  bedrooms: [''],
  rooms: [],
}

const generalFeaturesPlaceholder = () => {
  return (
    <div className="flex flex-col items-start mb-px leading-relaxed">
      <p>- e.g. trendy neighbourhood</p>
      <p>- famous for nightlife</p>
      <p>- Great location for exploring the city</p>
    </div>
  )
}

const maxInputs = 2000

const New = ({ runsRemaining, setRunsRemaining }) => {
  const [inputFields, setInputFields] = useState(newInputFields);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [fullListing, setFullListing] = useState(null);
  const [results, setResults] = useState([]);

  //const onResult = useScrollOnResult(results);
  //
  const consolidateInput = () => {
    const { property_type, location, key_features, bedrooms, rooms } = inputFields;
    const roomDescs = rooms.map(r => (r.name + r.description)).join("");
    return property_type + location + key_features + bedrooms.join("") + roomDescs;
  }

  const handleNewResults = (newResults) => {
    const newList = taskRun.is_rerun ? [...results, ...newResults] : newResults;
    setResults(newList);
    setLoading(false);
  }

  const setField = (field, value) => {
    setInputFields({ ...inputFields, [field]: value });
  }

  const setBedroomCount = (newCount) => {
    if (newCount < inputFields.bedrooms.length) {
      setInputFields({
        ...inputFields,
        bedrooms: inputFields.bedrooms.slice(0, newCount),
        bedroom_count: newCount
      });
    } else {
      setInputFields({
        ...inputFields,
        bedrooms: [ ...inputFields.bedrooms, '' ],
        bedroom_count: newCount
      });
    }
  }

  const handleRequestSuccess = (response) => {
    setErrors(null);
    setRunsRemaining(response.data.runs_remaining)
    setFullListing(response.data.full_listing);
  }

  const assembleHeadline = () => {
    const { bedroom_count, property_type, location, ideal_for, key_features } = inputFields;
    const first = `- ${bedroom_count} bedroom ${property_type} in ${location}\n`;
    const second = ideal_for.length > 3 ? `- ideal for ${ideal_for}\n` : "";
    return `${first}${second}${key_features}`
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/full_listings.json",
      {
        full_listing: {
          ...inputFields,
          headline_text: assembleHeadline(),
          high_flair: false
        }
      },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }

  const updateBedroomInState = (index, newValue) => {
    const { bedrooms } = inputFields;
    let newBedrooms = [ ...bedrooms ];
    newBedrooms[index] = newValue;
    setField('bedrooms', newBedrooms);
  }

  const setInputIfValid = (key, value, limit) => {
    if (value.length <= limit) {
      setField(key, value);
    }
  }

  const textInputRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3 text-sm text-gray-800">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => setInputIfValid(key, e.target.value, 35)}
          className="w-full text-sm form-inline-field"
        />
      </div>
    )
  }

  const detailField = (title, fieldName, placeholder) => {
    const charsLeft = 200 - inputFields[fieldName].length;
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-start w-full">
          <label className="flex-shrink-0 mt-3 w-1/3 text-sm text-gray-700">{title}</label>
          <div className="px-3 w-full">
            <TextareaWithPlaceholder
              value={inputFields[fieldName]}
              onChange={(value) => setInputIfValid(fieldName, value, 200)}
              heightClass={"h-32"}
              placeholderContent={placeholder()}
              customClasses={"text-sm"}
            />
          </div>
        </div>
        <div className="self-end pt-2 pr-3 text-xs font-medium text-gray-500">
          {charsLeft <= 30 && <p className={charsLeft <= 10 ? "text-red-500" : ""}>{charsLeft}</p>}
        </div>
      </div>
    )
  }

  const detailPlaceholder = (placeholderText, index) => {
    return (
      <div className="flex flex-col items-start mb-px leading-relaxed">
        <p>{index == 0 ? placeholderText : ""}</p>
      </div>
    )
  }

  const bedroomRow = (title, index, placeholderText) => {
    return (
      <BedroomInput
        key={index}
        bedrooms={inputFields.bedrooms}
        title={title}
        index={index}
        updateIndex={(index, value) => updateBedroomInState(index, value)}
        placeholderContent={detailPlaceholder(placeholderText, index)}
      />
    )
  }

  const bedroomsCountRow = () => {
    return (
      <NumberField
        title="Bedrooms"
        value={inputFields.bedroom_count}
        onChange={(v) => setBedroomCount(v)}
        minValue={1}
        maxValue={4}
      />
    )
  }

  const bedroomFields = () => {
    const number = inputFields.bedroom_count === "" ? 1 : parseInt(inputFields.bedroom_count);
    const arrayOfIndexes = Array.from(Array(number).keys())
    const bedroomRows = arrayOfIndexes.map((i) => {
      return (
        bedroomRow(`Bedroom ${i + 1}`, i, 'e.g. double bed, ensuite...')
      )
    });

    return (
      <div className="flex flex-col my-4">
        <div className="my-4 w-full h-px bg-gray-200"></div>
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Bedrooms</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add details specific to each bedroom.
          </p>
        </div>
        <div className="mb-4 w-full h-px bg-gray-200"></div>
        {bedroomRows}
      </div>
    )
  }

  const roomForm = () => {
    return (
      <OtherRoomForm
        rooms={inputFields.rooms}
        onChange={(rooms) => setField('rooms', rooms)}
        showHeader={true}
      />
    )
  }

  const showResults = () => {
    if (fullListing && fullListing.text !== "") {
      const results = [{
        id: fullListing.id,
        object_type: "FullListing",
        result_text: fullListing.text
      }]
      return (
        <div className="flex flex-col items-center py-8 w-full">
          <ResultList results={results} />
          <RequestCounter runsRemaining={runsRemaining} />
        </div>
      )
    }
  }

  const fullListingForm = () => {
    return (
      <form className="flex flex-col items-center w-full text-sm" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {textInputRow('Property type', 'property_type', 'e.g. apartment, house...', true)}
          {textInputRow('Location', 'location', '', true)}
          {textInputRow('Ideal for', 'ideal_for', 'e.g. families, couples', '', false)}
          {bedroomsCountRow()}
          {detailField('Key Features', 'key_features', generalFeaturesPlaceholder)}
          {bedroomFields()}
          {roomForm()}
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={consolidatedInput}
              userInputLength={consolidatedInput.length}
              maxUserInput={maxInputs}
              loading={loading}
              runsRemaining={runsRemaining}
            />
          </div>
        </div>
        <div className="flex justify-center items-center py-2 px-2 w-full text-center align-middle bg-gray-200">
          <p className="text-sm font-medium text-gray-900">Please note: this is a new feature that is still undergoing development. Results will get better as we make improvements.</p>
        </div>
      </form>
    )
  }

  const fullListingPoll = () => {
    return (
      <FullListingPoll
        fullListing={fullListing}
        onComplete={(completedListing) => { setFullListing(completedListing); setLoading(false) }}
        onError={setErrors}
      />
    )
  }

  const consolidatedInput = consolidateInput();

  return (
    <div className="overflow-hidden w-full">
      <div className="flex flex-col items-center pt-2 w-full h-full">
        {fullListingForm()}
        {fullListingPoll()}
        {showResults()}
      </div>
    </div>
  )
}

export default New;
