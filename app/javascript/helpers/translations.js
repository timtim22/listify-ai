export const supportedLanguages = [
  { name: "English", value: "EN" },
  { name: "Danish", value: "DA" },
  { name: "Dutch", value: "NL" },
  { name: "French", value: "FR" },
  { name: "German", value: "DE" },
  { name: "Italian", value: "IT" },
  { name: "Spanish", value: "ES" },
]

export const translationFor = (language, phrase) => {
  const translations = {
    DA: {
      "bedrooms": "soveværelser",
      "property type": "egenskabstype",
      "location": "sted",
      "key features": "nøgleattributter",
      "ideal for": "ideel til"
    },
    DE: {
      "bedrooms": "schlafzimmer",
      "property type": "art der immobilie",
      "location": "ort",
      "key features": "hauptmerkmale",
      "ideal for": "ideal für"
    },
    ES: {
      "bedrooms": "dormitorios",
      "property type": "tipo de propiedad",
      "location": "ubicación",
      "key features": "características principales",
      "ideal for": "ideal para"
    },
    FR: {
      "bedrooms": "chambres",
      "property type": "type de propriété",
      "location": "emplacement",
      "key features": "principales caractéristiques",
      "ideal for": "idéal pour"
    },
    IT: {
      "bedrooms": "camere",
      "property type": "tipo di proprietà",
      "location": "ubicazione",
      "key features": "caratteristiche principali",
      "ideal for": "ideale per"
    },
    NL: {
      "bedrooms": "Slaapkamers",
      "property type": "type woning",
      "location": "plaats",
      "key features": "belangrijkste kenmerken",
      "ideal for": "ideaal voor"
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
