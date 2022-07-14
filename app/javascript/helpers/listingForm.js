import { translationFor } from './translations';

export const newInputFields = {
  property_type: '',
  bedrooms: 1,
  location: '',
  ideal_for: '',
  key_features: ''
}

export const exampleInputFields = {
  property_type: 'apartment',
  bedrooms: 3,
  location: 'Malaga',
  ideal_for: 'families',
  key_features: '- sea views\n- large balcony\n- heated swimming pool\n- open plan living space\n- 5 minutes walk to shops and restaurants\n- short drive to the airport',
}

export const trueUserInputLength = (inputFields) => {
  return Object.values(inputFields).join("").length;
}

export const idealStr = (idealFor, inputLanguage) => {
  if (idealFor && idealFor.length > 0) {
    return `\n- ${translationFor(inputLanguage, 'ideal for')} ${idealFor}`;
  } else {
    return '';
  }
}

export const featureStr = (keyFeatures) => {
  if (keyFeatures && keyFeatures.length > 0) {
    const lines = keyFeatures.split("\n");
    const str = lines.map(l => l.startsWith("-") ? l : `- ${l}`).join("\n");
    return `\n${str}`;
  } else {
    return '';
  }
}
