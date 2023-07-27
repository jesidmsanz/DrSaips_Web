export default function formatNumberWithDecimals(number) {
  const roundedNumber = parseFloat(number.toFixed(2)); // Redondeamos a dos decimales sin importar si el último es cero o no
  const decimalPart = roundedNumber.toString().split(".")[1]; // Obtenemos el último decimal

  // Si el último decimal es cero, mostramos solo un decimal, de lo contrario, mostramos dos decimales
  const decimalLimit = decimalPart && decimalPart.endsWith("0") ? 1 : 2;

  return parseFloat(roundedNumber.toFixed(decimalLimit));
}
