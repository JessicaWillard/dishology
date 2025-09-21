import type {
  RecipeFormData,
  RecipeIngredientFormData,
} from "@/utils/types/database";

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export function validateRecipe(data: RecipeFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name?.trim()) {
    errors.name = "Recipe name is required";
  } else if (data.name.length > 255) {
    errors.name = "Recipe name must be less than 255 characters";
  }

  if (data.description && data.description.length > 1000) {
    errors.description = "Description must be less than 1000 characters";
  }

  if (data.batch_size !== undefined && data.batch_size !== null) {
    if (data.batch_size <= 0) {
      errors.batch_size = "Batch size must be greater than 0";
    }
  }

  if (data.batch_unit && data.batch_unit.length > 50) {
    errors.batch_unit = "Batch unit must be less than 50 characters";
  }

  if (data.units !== undefined && data.units !== null) {
    if (data.units <= 0) {
      errors.units = "Units must be greater than 0";
    }
  }

  if (data.prep_time && data.prep_time.length > 50) {
    errors.prep_time = "Prep time must be less than 50 characters";
  }

  if (data.instructions && data.instructions.length > 5000) {
    errors.instructions = "Instructions must be less than 5000 characters";
  }

  return errors;
}

export function validateRecipeIngredient(
  data: RecipeIngredientFormData,
  index?: number
): ValidationErrors {
  const errors: ValidationErrors = {};
  const prefix = index !== undefined ? `ingredient_${index}_` : "";

  if (!data.inventory_id?.trim()) {
    errors[`${prefix}inventory_id`] = "Ingredient is required";
  }

  if (data.quantity === undefined || data.quantity === null) {
    errors[`${prefix}quantity`] = "Quantity is required";
  } else if (data.quantity <= 0) {
    errors[`${prefix}quantity`] = "Quantity must be greater than 0";
  }

  if (data.unit && data.unit.length > 50) {
    errors[`${prefix}unit`] = "Unit must be less than 50 characters";
  }

  return errors;
}

export function validateRecipeWithIngredients(
  recipeData: RecipeFormData,
  ingredients: RecipeIngredientFormData[]
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate recipe data
  const recipeErrors = validateRecipe(recipeData);
  Object.assign(errors, recipeErrors);

  // Validate ingredients
  ingredients.forEach((ingredient, index) => {
    const ingredientErrors = validateRecipeIngredient(ingredient, index);
    Object.assign(errors, ingredientErrors);
  });

  // Check for duplicate ingredients
  const inventoryIds = ingredients
    .map((ing) => ing.inventory_id)
    .filter(Boolean);
  const duplicates = inventoryIds.filter(
    (id, index) => inventoryIds.indexOf(id) !== index
  );

  if (duplicates.length > 0) {
    errors.ingredients = "Duplicate ingredients are not allowed";
  }

  return errors;
}

export function validateField(
  fieldName: string,
  value: string | number | null | undefined
): string | undefined {
  switch (fieldName) {
    case "name":
      if (!value || (typeof value === "string" && !value.trim())) {
        return "Recipe name is required";
      }
      if (typeof value === "string" && value.length > 255) {
        return "Recipe name must be less than 255 characters";
      }
      break;

    case "description":
      if (typeof value === "string" && value.length > 1000) {
        return "Description must be less than 1000 characters";
      }
      break;

    case "batch_size":
      if (typeof value === "number" && value <= 0) {
        return "Batch size must be greater than 0";
      }
      break;

    case "batch_unit":
      if (typeof value === "string" && value.length > 50) {
        return "Batch unit must be less than 50 characters";
      }
      break;

    case "prep_time":
      if (typeof value === "string" && value.length > 50) {
        return "Prep time must be less than 50 characters";
      }
      break;

    case "instructions":
      if (typeof value === "string" && value.length > 5000) {
        return "Instructions must be less than 5000 characters";
      }
      break;

    case "quantity":
      if (value === null || value === undefined) {
        return "Quantity is required";
      }
      if (typeof value === "number" && value <= 0) {
        return "Quantity must be greater than 0";
      }
      break;

    case "unit":
      if (typeof value === "string" && value.length > 50) {
        return "Unit must be less than 50 characters";
      }
      break;
  }

  return undefined;
}

// Validation helper for batch size vs unit size warning
export function validateBatchSizeWarning(
  batchSize: number | null | undefined,
  unitSize: number | null | undefined
): string | undefined {
  if (batchSize && unitSize && batchSize < unitSize) {
    return "Warning: Batch size is smaller than unit size";
  }
  return undefined;
}
