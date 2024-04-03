// Función para convertir de '2023-07-14' a '01-02-15'
export const convertToCustomDate = (isoDateString) => {
  if (!isoDateString) return null;
  const [year, month, day] = isoDateString.split("-");
  const customYear = year.slice(2); // Eliminar los dos primeros dígitos del año
  const customDate = `${day}-${month}-${customYear}`;
  return customDate;
};
export const convertToCustomDate2 = (isoDateString) => {
  if (!isoDateString) return null;
  const [year, month, day] = isoDateString.split("-");
  const customYear = year.slice(2); // Eliminar los dos primeros dígitos del año
  const customDate = `${month}-${day}-${customYear}`;
  return customDate;
};
