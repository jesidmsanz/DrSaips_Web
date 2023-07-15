export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Obtener la fecha actual
const currentDate = new Date();
const currentFormattedDate = formatDate(currentDate);
console.log("Fecha actual:", currentFormattedDate);

// Obtener la fecha de hace un mes
const oneMonthAgoDate = new Date();
oneMonthAgoDate.setMonth(oneMonthAgoDate.getMonth() - 1);
const oneMonthAgoFormattedDate = formatDate(oneMonthAgoDate);
console.log("Fecha de hace un mes:", oneMonthAgoFormattedDate);
