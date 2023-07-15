// Función para convertir de '2023-07-14' a '01-02-2015'
export const convertToCustomDate = (isoDateString) => {
  const [year, month, day] = isoDateString.split("-");
  const customYear = year.slice(2); // Eliminar los dos primeros dígitos del año
  const customDate = `${day}-${month}-${customYear}`;
  return customDate;
};

