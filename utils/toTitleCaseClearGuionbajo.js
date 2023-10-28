export default function convertToTitleCaseAndReplaceUnderscores(inputString) {
  // Reemplaza todos los '_' con espacios
  let stringWithoutUnderscores = inputString.replace(/_/g, " ");

  // Divide la cadena en palabras y convierte la primera letra de cada palabra a mayúscula
  let words = stringWithoutUnderscores.toLowerCase().split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Vuelve a unir las palabras y devuelve el resultado
  return words.join(" ");
}
