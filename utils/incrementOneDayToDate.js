export const incrementOneDayToDate = (date) => {
  // Input date string in the format 'dd-mm-yy'
  const inputDateStr = date;

  if (!inputDateStr) return null;

  // Extract day, month, and year from the input date string
  const day = parseInt(inputDateStr.substr(0, 2));
  const month = parseInt(inputDateStr.substr(3, 2)) - 1; // Months are zero-based (0-11)
  const year = 2000 + parseInt(inputDateStr.substr(6, 2)); // Assuming years are in 21st century (2000-2099)

  // Create a Date object with the given date
  const inputDate = new Date(year, month, day);

  // Add one day to the date
  inputDate.setDate(inputDate.getDate() + 1);

  // Format the result as dd-mm-yy
  const resultDateStr = `${inputDate.getDate().toString().padStart(2, "0")}-${(
    inputDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${(inputDate.getFullYear() % 100)
    .toString()
    .padStart(2, "0")}`;

  return resultDateStr; // Output: '28-06-23'
};
