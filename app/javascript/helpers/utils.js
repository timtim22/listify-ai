export const cleanObjectInputText = (object) => {
  let inputText = object.input_text;
  if (!inputText) { return object };
  let cleanText = inputText.trim();
  if (cleanText[-1] !== ".") { cleanText = cleanText + "." }
  return {...object, input_text: cleanText };
}
