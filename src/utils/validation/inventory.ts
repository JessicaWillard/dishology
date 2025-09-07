import type { InventoryFormData, InventoryType } from "@/utils/types/database";

export interface ValidationErrors {
  [key: string]: string | undefined;
}

const VALID_INVENTORY_TYPES: InventoryType[] = [
  "produce",
  "dry",
  "meat",
  "dairy",
  "beverage",
  "cleaning",
  "smallwares",
  "equipment",
  "other",
];

export function validateInventory(data: InventoryFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Required fields
  if (!data.name?.trim()) {
    errors.name = "Inventory item name is required";
  } else if (data.name.trim().length > 255) {
    errors.name = "Name must be less than 255 characters";
  }

  if (!data.type || !VALID_INVENTORY_TYPES.includes(data.type)) {
    errors.type = "Please select a valid inventory type";
  }

  if (!data.quantity?.trim()) {
    errors.quantity = "Quantity is required";
  } else if (isNaN(Number(data.quantity)) || Number(data.quantity) < 0) {
    errors.quantity = "Quantity must be a valid positive number";
  }

  if (!data.price_per_unit?.trim()) {
    errors.price_per_unit = "Price per unit is required";
  } else if (
    isNaN(Number(data.price_per_unit)) ||
    Number(data.price_per_unit) < 0
  ) {
    errors.price_per_unit = "Price per unit must be a valid positive number";
  }

  if (!data.count_date?.trim()) {
    errors.count_date = "Count date is required";
  } else {
    const date = new Date(data.count_date);
    if (isNaN(date.getTime())) {
      errors.count_date = "Please enter a valid date";
    }
  }

  // Optional fields validation
  if (data.description && data.description.length > 1000) {
    errors.description = "Description must be less than 1000 characters";
  }

  if (data.size && isNaN(Number(data.size))) {
    errors.size = "Size must be a valid number";
  }

  if (
    data.price_per_pack &&
    (isNaN(Number(data.price_per_pack)) || Number(data.price_per_pack) < 0)
  ) {
    errors.price_per_pack = "Price per pack must be a valid positive number";
  }

  if (
    data.min_count &&
    (isNaN(Number(data.min_count)) || Number(data.min_count) < 0)
  ) {
    errors.min_count = "Minimum count must be a valid positive number";
  }

  if (data.location && data.location.length > 100) {
    errors.location = "Location must be less than 100 characters";
  }

  return errors;
}

export function validateField(
  fieldName: string,
  value: string | number
): string | undefined {
  switch (fieldName) {
    case "name":
      if (!value || (typeof value === "string" && !value.trim())) {
        return "Inventory item name is required";
      }
      if (typeof value === "string" && value.length > 255) {
        return "Name must be less than 255 characters";
      }
      break;

    case "type":
      if (
        typeof value === "string" &&
        !VALID_INVENTORY_TYPES.includes(value as InventoryType)
      ) {
        return "Please select a valid inventory type";
      }
      break;

    case "quantity":
      if (!value || (typeof value === "string" && !value.trim())) {
        return "Quantity is required";
      }
      if (isNaN(Number(value)) || Number(value) < 0) {
        return "Quantity must be a valid positive number";
      }
      break;

    case "price_per_unit":
      if (!value || (typeof value === "string" && !value.trim())) {
        return "Price per unit is required";
      }
      if (isNaN(Number(value)) || Number(value) < 0) {
        return "Price per unit must be a valid positive number";
      }
      break;

    case "count_date":
      if (!value || (typeof value === "string" && !value.trim())) {
        return "Count date is required";
      }
      if (typeof value === "string") {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return "Please enter a valid date";
        }
      }
      break;

    case "description":
      if (typeof value === "string" && value.length > 1000) {
        return "Description must be less than 1000 characters";
      }
      break;

    case "size":
      if (value && isNaN(Number(value))) {
        return "Size must be a valid number";
      }
      break;

    case "price_per_pack":
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        return "Price per pack must be a valid positive number";
      }
      break;

    case "min_count":
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        return "Minimum count must be a valid positive number";
      }
      break;

    case "location":
      if (typeof value === "string" && value.length > 100) {
        return "Location must be less than 100 characters";
      }
      break;
  }

  return undefined;
}

// Helper function to get required fields for form validation
export function getRequiredFields(): (keyof InventoryFormData)[] {
  return ["name", "type", "quantity", "price_per_unit", "count_date"];
}

// Helper function to check if a field is required
export function isFieldRequired(fieldName: keyof InventoryFormData): boolean {
  return getRequiredFields().includes(fieldName);
}
