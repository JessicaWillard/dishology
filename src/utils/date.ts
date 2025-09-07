/**
 * Formats a date string to dd-mm-yyyy format
 * @param dateString - The date string to format
 * @returns Formatted date string in dd-mm-yyyy format
 */
export function formatDateFromString(dateString: string): string {
  if (!dateString) {
    // If no date is provided, show today's date instead of "-"
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  try {
    // Handle both ISO timestamps and simple date strings
    let date: Date;

    if (dateString.includes("T")) {
      // It's an ISO timestamp, extract just the date part to avoid timezone issues
      const datePart = dateString.split("T")[0]; // Get "2025-09-07" from "2025-09-07T00:00:00+00:00"
      date = new Date(datePart + "T00:00:00");
    } else {
      // It's a simple date string, add time to avoid timezone issues
      date = new Date(dateString + "T00:00:00");
    }

    if (isNaN(date.getTime())) {
      return "-";
    }

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
    // Handle both ISO timestamps and simple date strings
    let date: Date;

    if (dateString.includes("T")) {
      // It's an ISO timestamp, extract just the date part to avoid timezone issues
      const datePart = dateString.split("T")[0]; // Get "2025-09-07" from "2025-09-07T00:00:00+00:00"
      date = new Date(datePart + "T00:00:00");
    } else {
      // It's a simple date string, add time to avoid timezone issues
      date = new Date(dateString + "T00:00:00");
    }

    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}
