export const customInputStructures = {
  oyo_one: [
    { key: 'property_type', title: 'Property Type', field_type: 'string', default: '' },
    { key: 'target_user', title: 'Target user', field_type: 'string', default: '' },
    { key: 'location', title: 'location', field_type: 'string', default: '' },
    { key: 'location_detail', title: 'Location detail', field_type: 'string', default: '' },
    { key: 'usp_one', title: 'USP 1', field_type: 'string', default: '' },
    { key: 'usp_two', title: 'USP 2', field_type: 'string', default: '' },
    { key: 'usp_three', title: 'USP 3', field_type: 'string', default: '' },
  ],
  oyo_two: [
    { key: 'usp_one', title: 'USP 1', field_type: 'string', default: '' },
    { key: 'usp_two', title: 'USP 2', field_type: 'string', default: '' },
    { key: 'usp_three', title: 'USP 3', field_type: 'string', default: '' },
    { key: 'usp_four', title: 'USP 4', field_type: 'string', default: '' },
    { key: 'usp_five', title: 'USP 5', field_type: 'string', default: '' },
  ],
  oyo_three: [
    { key: 'usp_one', title: 'USP 1', field_type: 'string', default: '' },
    { key: 'usp_two', title: 'USP 2', field_type: 'string', default: '' },
    { key: 'usp_three', title: 'USP 3', field_type: 'string', default: '' },
    { key: 'usp_four', title: 'USP 4', field_type: 'string', default: '' },
    { key: 'usp_five', title: 'USP 5', field_type: 'string', default: '' },
  ],
  sykes_middle: [
    { key: 'key_features', title: 'Key Features', field_type: 'text', default: '' }
  ],
  vacasa_one: [
    { key: 'property_type', title: 'Property Type', field_type: 'string', default: '' },
    { key: 'property_name', title: 'Property name (optional)', field_type: 'string', default: '' },
    { key: 'target_user', title: 'Target user', field_type: 'string', default: '' },
    { key: 'location', title: 'location', field_type: 'string', default: '' },
    { key: 'usp_one', title: 'Detail 1', field_type: 'string', default: '' },
    { key: 'usp_two', title: 'Detail 2', field_type: 'string', default: '' },
    { key: 'usp_three', title: 'Detail 3', field_type: 'string', default: '' },
    { key: 'usp_four', title: 'Detail 4', field_type: 'string', default: '' },
    { key: 'usp_five', title: 'Detail 5', field_type: 'string', default: '' },
  ],
}

export const customInputs = Object.keys(customInputStructures);

export const customInputFields = (name) => {
  return customInputStructures[name];
}

export const customInputFieldKeys = (name) => {
  return customInputStructures[name].map(f => f.key);
}
