import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import SelectField from '../common/SelectField';
import RoomForm from './RoomForm';
import FullListingPoll from './FullListingPoll';
import Submit from '../inputs/Submit';

const newInputFields = {
  propertyType: '',
  bedroom_count: 1,
  sleeps: 2,
  general_features: '',
  bedrooms: [''],
  rooms: [],
  location: '',
  idealFor: '',
}

const coerceWithinRange = (inputNumber, min, max) => {
  const number = parseInt(inputNumber);
  if (number < min) { return min; }
  if (number > max) { return max; }
  return number;
}

const generalFeaturesPlaceholder = () => {
  return (
    <div className="flex flex-col items-start mb-px">
      <p>- e.g. trendy neighbourhood</p>
      <p>- famous for nightlife</p>
      <p>- Great location for exploring the city</p>
    </div>
  )
}

const userInputLength = 0
const maxInput = 250
const runsRemaining = 1

const New = ({ initialRunsRemaining }) => {
  const [runsRemaining, setRunsRemaining] = useState(initialRunsRemaining);
  const [inputFields, setInputFields] = useState(newInputFields);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [fullListing, setFullListing] = useState(null);
  const [results, setResults] = useState([]);

  //const onResult = useScrollOnResult(results);

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
    setRunsRemaining(response.data.runs_remaining);
    setFullListing(response.data.full_listing);
    console.log(response)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/full_listings.json",
      {
        full_listing: inputFields
      },
      (response) => { handleRequestSuccess(response) },
      (e) => { setErrors(e); setLoading(false) }
    )
  }


  const formHeader = () => {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="p-4 w-full font-semibold tracking-wide text-gray-800 bg-purple-100">
          <p>
            Thanks for joining our private beta! We're still building our product, and making lots of improvements.
            Please do give us feedback, it really helps!
          </p>
        </div>
        <h1 className="my-8 text-xl font-medium tracking-wider text-gray-700">
          Listings Generator
        </h1>
        <div className="mt-4 mb-8 w-3/4 h-px bg-gray-300"></div>
     </div>
    )
  }

  const detailField = (title, fieldName, placeholder) => {
    return (
      <div className="flex flex-col justify-center w-full">
        <label className="font-semibold">{title}</label>
        <div className="my-2 w-full">
          <TextareaWithPlaceholder
            value={inputFields[fieldName]}
            onChange={(value) => setField(fieldName, value)}
            heightClass={"h-24"}
            placeholderContent={placeholder()}
          />
        </div>
      </div>
    )
  }

  const updateBedroomInState = (index, newValue) => {
    const { bedrooms } = inputFields;
    let newBedrooms = [ ...bedrooms ];
    newBedrooms[index] = newValue;
    setField('bedrooms', newBedrooms);
  }

  const bedroomRow = (title, index, placeholderText, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="flex-shrink-0 w-1/3">{title}</label>
        <input
          type="text"
          placeholder={placeholderText}
          required={required}
          value={inputFields.bedrooms[index]}
          onChange={(e) => {updateBedroomInState(index, e.target.value)}}
          className="w-full form-inline-field"
        />
      </div>
    )
  }

  const numberRow = (title, fieldName) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="w-1/3">{title}</label>
        <input
          type="number"
          min="1"
          max="8"
          placeholder="2"
          required={true}
          value={inputFields[fieldName]}
          onChange={(e) => {setField(fieldName, coerceWithinRange(e.target.value, 1, 8))}}
          className="w-16 form-inline-field"
        />
      </div>
    )
  }

  const bedroomCount = () => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="w-1/3">Bedrooms</label>
        <input
          type="number"
          min="1"
          max="8"
          placeholder="2"
          required={true}
          value={inputFields.bedroom_count}
          onChange={(e) => {setBedroomCount(coerceWithinRange(e.target.value, 1, 8))}}
          className="w-16 form-inline-field"
        />
      </div>
    )
  }



  const bedroomFields = () => {
    const arrayOfIndexes = Array.from(Array(inputFields.bedroom_count).keys())
    const bedroomRows = arrayOfIndexes.map((i) => {
      return (
        bedroomRow(`Bedroom ${i + 1}`, i, 'double bed, ensuite', false)
      )
    });
    return (
      <div className={"flex flex-col"}>
        <h2>Bedrooms</h2>
        {bedroomRows}
      </div>
    )
  }

  const select = () => {
    return (
      <SelectField
        label={"Add rooms"}
        defaultValue={{ value: null, label: 'room' }}
        options={['kitchen', 'sitting room'].map((i) => { return {value: i, label: i} })}
        onChange={option => setField('room', option['value']) }
        isSearchable={true}
        isClearable={true}
        isCreatable={true}
      />
    )
  }

  const roomForm = () => {
    return (
      <RoomForm
        rooms={inputFields.rooms}
        showName={true}
        onChange={(rooms) => setField('rooms', rooms)}
        sectionTitle={"Other rooms and spaces"}
      />
    )
  }

  const showResults = () => {
    if (fullListing && fullListing.text !== "") {
      return (
        <p>{fullListing.text}</p>
      )
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {formHeader()}
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {bedroomCount()}
          {numberRow('Sleeps', 'sleeps')}
          {detailField('General Features', 'general_features', generalFeaturesPlaceholder)}
          {bedroomFields()}
          {roomForm()}
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={inputFields.general_features}
              userInputLength={userInputLength}
              maxUserInput={maxInput}
              loading={loading}
              runsRemaining={runsRemaining}
            />
          </div>
        </div>
      </form>
      <FullListingPoll
        fullListing={fullListing}
        onComplete={(completedListing) => { setFullListing(completedListing); setLoading(false) }}
        onError={setErrors}
      />
      {showResults()}
    </div>
  )
}

export default New;
