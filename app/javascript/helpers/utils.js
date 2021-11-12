export const cleanObjectInputText = (object) => {
  let inputText = object.input_text;
  if (!inputText) { return object };
  let cleanText = inputText.trim();
  if (cleanText[cleanText.length-1] !== ".") { cleanText = cleanText + "." }
  return {...object, input_text: cleanText };
}

export const supportedLanguages = [
  { name: "English", value: "EN" },
  { name: "Danish", value: "DA" },
  { name: "French", value: "FR" },
  { name: "German", value: "DE" },
  { name: "Italian", value: "IT" },
  { name: "Spanish", value: "ES" },
]
