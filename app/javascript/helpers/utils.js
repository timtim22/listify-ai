export const cleanObjectInputText = (object) => {
  let inputText = object.input_text;
  if (!inputText) { return object };
  let cleanText = inputText.trim();
  if (cleanText[cleanText.length-1] !== ".") { cleanText = cleanText + "." }
  return {...object, input_text: cleanText };
}

export const capitaliseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
