export function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

export function formatDateToYYYYMMDD(dateStr) {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}
