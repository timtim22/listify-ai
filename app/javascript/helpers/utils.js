export const tableDate = (date) => {
  return date.toLocaleTimeString(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }
  )
}

export const groupBy = (array, key) => {
  return array.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const sortObjectsByDate = (array) => {
  return array.sort(function(a,b){
    return new Date(b.date) - new Date(a.date);
  });
}

export const cleanObjectInputText = (object) => {
  let inputText = object.input_text;
  if (!inputText) { return object }
  let cleanText = inputText.trim().replace(/\n-$/, "");
  if (cleanText.length > 0 && cleanText[cleanText.length-1] !== ".") { cleanText = cleanText + "." }
  return {...object, input_text: cleanText };
}

export const capitaliseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const coerceWithinRange = (inputNumber, min, max) => {
  if (inputNumber === "") {
    return inputNumber;
  } else {
    const number = parseInt(inputNumber);
    if (number < min) { return min; }
    if (number > max) { return max; }
    return number;
  }
}

export const randId = () => {
  return Math.random().toString().substr(2, 8);
}

export const bedroomTextForBackend = (bedrooms) => {
  return bedrooms.map((b, i) => {
    return `bedroom ${i + 1}: ${bedText(b)}${b.details}`
  }).join("\n");
}

const bedText = (bedroom) => {
  const { bed, details } = bedroom;
  if (!bed || bed === '' || bed.toLowerCase().includes('other')) {
    return '';
  } else {
    const s = bed === 'twin' ? 's' : '';
    const comma = details.length > 0 ? ', ' : '';
    return `${bed} bed${s}${comma}`
  }
};
