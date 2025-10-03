export const getDDMMYYYY = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const getTodayAndFutureDate = (daysAhead: number): { todayFormatted: string; futureFormatted: string } => {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + daysAhead);

  return {
    todayFormatted: getDDMMYYYY(today),
    futureFormatted: getDDMMYYYY(future)
  };
};
export const getconvertDateFormat = (date: string): string => {
  // Split the date (dd/mm/yyyy) into day, month, and year
  //converting dd/mm/yyyy to mm/dd/yyyy
  const [day, month, year] = date.split('/');

  // Return the date in mm/dd/yyyy format
  return `${month}/${day}/${year}`;
};

export const getFormattedDate = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
