import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createRequest } from '../../helpers/requests';
import ErrorNotice from '../common/ErrorNotice';
import ResultList from '../common/ResultList';
import TextareaWithPlaceholder from '../common/TextareaWithPlaceholder';
import RoomForm from './RoomForm';
import FullListingPoll from './FullListingPoll';
import Submit from '../inputs/Submit';

const newInputFields = {
  property_type: '',
  bedroom_count: 1,
  sleeps: 2,
  key_features: '',
  bedrooms: [''],
  rooms: [],
  location: '',
  idealFor: '',
}

const coerceWithinRange = (inputNumber, min, max) => {
  if (inputNumber === "") {
    return inputNumber;
  } else {
    const number = parseInt(inputNumber);
    if (number < min) { return min; }
    if (number > max) { return max; }
    return number;
  }
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
  //

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

  const assembleHeadline = () => {
    const { bedroom_count, property_type, location, key_features } = inputFields;
    const first = `- ${bedroom_count} bedroom ${property_type} in ${location}`
    return `${first}\n${key_features}`
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/full_listings.json",
      {
        full_listing: { ...inputFields, headline_text: assembleHeadline() }
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
        <div className="w-4/5 max-w-2xl flex justify-center">
          <div className="mb-8 w-full h-px bg-gray-300"></div>
        </div>
     </div>
    )
  }

  const setInputIfValid = (key, value, limit) => {
    if (value.length < limit) {
      setField(key, value);
    }
  }

  const textInputRow = (title, key, placeholder, required) => {
    return (
      <div className="flex justify-start items-center mb-2 w-full">
        <label className="text-sm font-medium text-gray-700 flex-shrink-0 w-1/3">{title}</label>
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          value={inputFields[key]}
          onChange={(e) => setInputIfValid(key, e.target.value, 30)}
          className="w-full form-inline-field text-sm"
        />
      </div>
    )
  }

  const detailField = (title, fieldName, placeholder) => {
    const charsLeft = 200 - inputFields[fieldName].length;
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-start w-full">
          <label className="mt-3 text-sm font-medium text-gray-700 flex-shrink-0 w-1/3">{title}</label>
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
        <div className="self-end pr-3 pt-2 text-xs font-medium text-gray-500">
          {charsLeft <= 30 && <p className={charsLeft <= 10 ? "text-red-500" : ""}>{charsLeft}</p>}
        </div>
      </div>
    )
  }

  const bedroomRow = (title, index, placeholderText, required) => {
    const charsLimit = 150;
    const charsLeft = charsLimit - inputFields.bedrooms[index].length;
    return (
      <div className="flex flex-col w-full">
        <div key={index} className={`${charsLeft <= 30 ? "" : "mb-4"} flex justify-start items-start mt-4 w-full`}>
          <label className="mt-3 text-sm font-medium text-gray-700 flex-shrink-0 w-1/3">{title}</label>
          <div className="w-full">
            <TextareaWithPlaceholder
              value={inputFields.bedrooms[index]}
              onChange={(value) => {charsLimit - value.length >= 0 && updateBedroomInState(index, value)}}
              heightClass={"h-16"}
              placeholderContent={<div className="flex flex-col items-start mb-px leading-relaxed"><p>{index == 0 ? placeholderText : ""}</p></div>}
              customClasses={"text-sm"}
            />
          </div>
        </div>
        <div className="self-end pt-1 pr-3 text-xs font-medium text-gray-500">
          {charsLeft <= 30 && <p className={charsLeft <= 10 ? "text-red-500" : ""}>{charsLeft}</p>}
        </div>
      </div>
    )
  }

  const numberRow = (title, fieldName) => {
    return (
      <div className="flex justify-start items-center flex-grow text-sm font-medium text-gray-700 ">
        <label className="">bedroom{inputFields.bedroom_count > 1 ? 's' : '' }, </label>
        <input
          type="number"
          min="1"
          max="20"
          placeholder="2"
          required={true}
          value={inputFields[fieldName]}
          onChange={(e) => {setField(fieldName, coerceWithinRange(e.target.value, 1, 20))}}
          className="w-16 form-inline-field text-sm"
        />
        <span> people.</span>
      </div>
    )
  }

  const bedroomsCountRow = () => {
    return (
      <div className="flex w-full justify-start items-center mb-2">
        <label className="w-1/3 text-sm">Bedrooms</label>
        <input
          type="number"
          min="1"
          max="8"
          placeholder="2"
          required={true}
          value={inputFields.bedroom_count}
          onChange={(e) => {setBedroomCount(coerceWithinRange(e.target.value, 1, 8))}}
          className="w-16 form-inline-field text-sm"
        />
        {numberRow('Sleeps', 'sleeps')}
      </div>
    )
  }

  const bedroomFields = () => {
    const number = inputFields.bedroom_count === "" ? 1 : parseInt(inputFields.bedroom_count);
    const arrayOfIndexes = Array.from(Array(number).keys())
    const bedroomRows = arrayOfIndexes.map((i) => {
      return (
        bedroomRow(`Bedroom ${i + 1}`, i, 'e.g. double bed, ensuite...', false)
      )
    });

    return (
      <div className={"flex flex-col my-4"}>
        <div className="my-4 w-full h-px bg-gray-300"></div>
        <div className="my-4">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Bedrooms</h2>
          <p className="mt-1 text-sm text-gray-500">
            Add details specific to each bedroom.
          </p>
        </div>
        <div className="mb-4 w-full h-px bg-gray-300"></div>
        {bedroomRows}
      </div>
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
        <ResultList results={[{ id: 1, result_text: fullListing.text }]} />
      )
    }
  }


  return (
    <div className="flex flex-col items-center w-full h-full">
      {formHeader()}
      <form className="flex flex-col items-center w-full text-sm" onSubmit={handleSubmit}>
        <div className="w-4/5">
          <ErrorNotice errors={errors} />
        </div>
        <div className="flex flex-col w-4/5 max-w-2xl">
          {textInputRow('Property type', 'property_type', 'e.g. apartment, house...', true)}
          {textInputRow('Location', 'location', '', true)}
          {bedroomsCountRow()}
          {detailField('Key Features', 'key_features', generalFeaturesPlaceholder)}
          {bedroomFields()}
          {roomForm()}
          <div className="flex justify-center py-8 w-full">
            <Submit
              inputText={inputFields.key_features}
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
