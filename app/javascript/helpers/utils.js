export const cleanObjectInputText = (object) => {
  let inputText = object.input_text;
  if (!inputText) { return object };
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
