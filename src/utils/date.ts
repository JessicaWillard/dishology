/**
 * Formats a date string to dd-mm-yyyy format
 * @param dateString - The date string to format
 * @returns Formatted date string in dd-mm-yyyy format
 */
export function formatDateFromString(dateString: string): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${day}-${month}-${year}`;
  } catch {
    return "-";
  }
}

/**
 * Converts a date string to yyyy-mm-dd format for HTML date inputs
 * @param dateString - The date string to convert
 * @returns Formatted date string in yyyy-mm-dd format
 */
export function formatDateForInput(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}
