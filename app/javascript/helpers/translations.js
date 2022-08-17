import { capitaliseFirstLetter } from './utils';

export const inputLanguages = () => standardLanguages;

export const outputLanguagesForUser = (user) => {
  if (user.enabled_modules.includes('eastern_languages')) {
    return easternLanguages;
  } else {
    return standardLanguages;
  }
}

const standardLanguages = [
  { name: "English", value: "EN" },
  { name: "Danish", value: "DA" },
  { name: "Dutch", value: "NL" },
  { name: "French", value: "FR" },
  { name: "German", value: "DE" },
  { name: "Italian", value: "IT" },
  { name: "Spanish", value: "ES" },
]

const easternLanguages = [
  { name: "English", value: "EN" },
  { name: "German", value: "DE" },
  { name: "Romanian", value: "RO" },
  { name: "Russian", value: "RU" },
  { name: "Chinese", value: "ZH" },
  { name: "Serbian (Latin)", value: "SR-LATN" },
  { name: "Serbian (Cyrillic)", value: "SR" },
]

export const translateLabel = (string, inputLanguage) => {
  const translation = translationFor(inputLanguage, string.toLowerCase());
  return capitaliseFirstLetter(translation);
}

export const translationFor = (language, phrase) => {
  const translations = {
    DA: {
      "bedrooms": "soveværelser",
      "property type": "egenskabstype",
      "location": "sted",
      "key features": "nøgleattributter",
      "ideal for": "ideel til",
       "advert type": "type annonce"
    },
    DE: {
      "bedrooms": "schlafzimmer",
      "property type": "art der immobilie",
      "location": "ort",
      "key features": "hauptmerkmale",
      "ideal for": "ideal für",
      "advert type": "art der werbung"
    },
    ES: {
      "bedrooms": "dormitorios",
      "property type": "tipo de propiedad",
      "location": "ubicación",
      "key features": "características principales",
      "ideal for": "ideal para",
      "advert type": "tipo de publicidad"
    },
    FR: {
      "bedrooms": "chambres",
      "property type": "type de propriété",
      "location": "emplacement",
      "key features": "principales caractéristiques",
      "ideal for": "idéal pour",
      "advert type": "genre de publicité"
    },
    IT: {
      "bedrooms": "camere",
      "property type": "tipo di proprietà",
      "location": "ubicazione",
      "key features": "caratteristiche principali",
      "ideal for": "ideale per",
      "advert type": "tipo di pubblicità"
    },
    NL: {
      "bedrooms": "Slaapkamers",
      "property type": "type woning",
      "location": "plaats",
      "key features": "belangrijkste kenmerken",
      "ideal for": "ideaal voor",
      "advert type": "soort reclame"
    },
  }

  if (translations[language] && translations[language][phrase]) {
    return translations[language][phrase];
  } else {
    return phrase;
  }
}

export const translatedSummaryString = (inputLanguage, bedroomCount, propertyType, location) => {
  switch(inputLanguage) {
    case 'EN':
      return `- ${bedroomCount} bedroom ${propertyType} in ${location}`
      break;
    case 'DA':
      return `- ${bedroomCount} værelses ${propertyType} i ${location}`
      break;
    case 'DE':
      return `- ${bedroomCount} schlafzimmer ${propertyType} in ${location}`
      break;
    case 'ES':
      return `- ${propertyType} de ${bedroomCount} dormitorios en ${location}`
      break;
    case 'FR':
      return `- ${propertyType} de ${bedroomCount} chambres à ${location}`
      break;
    case 'IT':
      return `- ${propertyType} con ${bedroomCount} camere da letto a ${location}`
      break;
    case 'NL':
      return `- ${bedroomCount} slaapkamer ${propertyType} in ${location}`
      break;
    default:
      return `- ${bedroomCount} bedroom ${propertyType} in ${location}`
  }
}
