import type { SupplierFormData } from "@/utils/types/database";

export interface ValidationErrors {
  [key: string]: string | undefined;
}

/**
 * Validates a supplier form data object
 */
export function validateSupplier(data: SupplierFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Required field validation
  if (!data.name?.trim()) {
    errors.name = "Supplier name is required";
  }

  // Optional but validate format if provided
  if (data.contact.email && !isValidEmail(data.contact.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (data.contact.phone && !isValidPhone(data.contact.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (data.contact.website && !isValidUrl(data.contact.website)) {
    errors.website = "Please enter a valid website URL";
  }

  return errors;
}

/**
 * Validates individual field values
 */
export function validateField(
  fieldName: string,
  value: string
): string | undefined {
  switch (fieldName) {
    case "name":
      if (!value?.trim()) {
        return "Supplier name is required";
      }
      if (value.length > 255) {
        return "Supplier name must be less than 255 characters";
      }
      break;

    case "description":
      if (value && value.length > 1000) {
        return "Description must be less than 1000 characters";
      }
      break;

    case "contactName":
      if (value && value.length > 255) {
        return "Contact name must be less than 255 characters";
      }
      break;

    case "email":
      if (value && !isValidEmail(value)) {
        return "Please enter a valid email address";
      }
      break;

    case "phone":
      if (value && !isValidPhone(value)) {
        return "Please enter a valid phone number";
      }
      break;

    case "website":
      if (value && !isValidUrl(value)) {
        return "Please enter a valid website URL";
      }
      break;
  }

  return undefined;
}

// Helper validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters for validation
  const cleaned = phone.replace(/\D/g, "");
  // Accept 10-15 digit phone numbers (international format)
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function isValidUrl(url: string): boolean {
  try {
    // Add protocol if missing
    const urlToTest = url.startsWith("http") ? url : `https://${url}`;
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
}
