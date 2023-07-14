// Función para convertir de '2023-07-14' a '01-02-2015'
export const convertToCustomDate = (isoDateString) => {
  const [year, month, day] = isoDateString.split("-");
  const customDate = `${day}-${month}-${year}`;
  return customDate;
};
