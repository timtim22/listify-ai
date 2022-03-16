export const defaultStepOrder = [
  'summary_fragment',
  'bedroom_fragment',
  'other_room_fragment',
  'area_description_fragment'
]

export const initialStepArray = [defaultStepOrder[0]];

export const displayNameFor = (stepName) => {
  const names = {
    summary_fragment: 'Key Features',
    bedroom_fragment: 'Bedrooms',
    other_room_fragment: 'Other Rooms',
    area_description_fragment: 'Area'
  }
  return names[stepName];
}

export const userCharactersFor = (stepName, inputFields) => {
  const functions = {
    summary_fragment: summaryUserCharacters,
    bedroom_fragment: bedroomsUserCharacters,
    other_room_fragment: otherRoomsUserCharacters,
    area_description_fragment: () => {} // validated separately
  }
  return functions[stepName](inputFields);
}

const summaryUserCharacters = (inputFields) => {
  const { property_type, location, key_features, ideal_for } = inputFields;
  return `${property_type} ${location} ${key_features} ${ideal_for}`;
}

const bedroomsUserCharacters = (inputFields) => {
  return inputFields.bedrooms.map(r => r.details).join(" ");
}

const otherRoomsUserCharacters = (inputFields) => {
  return inputFields.rooms.map(r => `${r.name} ${r.description}`).join(" ");
}
