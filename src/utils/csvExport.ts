/**
 * Generic CSV export utility for converting data arrays to CSV format
 */

export interface CSVExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string;
}

/**
 * Converts an array of objects to CSV format
 * @param data Array of objects to convert to CSV
 * @param options Configuration options for the export
 * @returns CSV string
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: CSVExportOptions = {}
): string {
  const { includeHeaders = true, delimiter = "," } = options;

  if (data.length === 0) {
    return "";
  }

  // Get all unique keys from all objects
  const allKeys = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  );

  // Create CSV content
  const csvRows: string[] = [];

  // Add headers if requested
  if (includeHeaders) {
    csvRows.push(allKeys.map((key) => escapeCSVField(key)).join(delimiter));
  }

  // Add data rows
  for (const item of data) {
    const row = allKeys.map((key) => {
      const value = item[key];
      return escapeCSVField(value);
    });
    csvRows.push(row.join(delimiter));
  }

  return csvRows.join("\n");
}

/**
 * Escapes a field value for CSV format
 * @param value The value to escape
 * @returns Escaped value
 */
function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // If the value contains delimiter, newline, or quotes, wrap in quotes and escape internal quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes("\n") ||
    stringValue.includes('"')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Downloads a CSV string as a file
 * @param csvContent The CSV content to download
 * @param filename The filename for the downloaded file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Exports data to CSV and triggers download
 * @param data Array of objects to export
 * @param options Configuration options for the export
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: CSVExportOptions = {}
): void {
  const { filename = "export.csv", ...csvOptions } = options;

  const csvContent = convertToCSV(data, csvOptions);
  downloadCSV(csvContent, filename);
}

/**
 * Formats a date for CSV export
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDateForCSV(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a currency value for CSV export
 * @param value Currency value as string
 * @returns Formatted currency string
 */
export function formatCurrencyForCSV(value: string | number): string {
  if (!value) return "0.00";

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
}
