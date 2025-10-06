import type {
  DishFormData,
  DishIngredientFormData,
} from "@/utils/types/database";

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export function validateDish(data: DishFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name?.trim()) {
    errors.name = "Dish name is required";
  } else if (data.name.length > 255) {
    errors.name = "Dish name must be less than 255 characters";
  }

  if (data.description && data.description.length > 1000) {
    errors.description = "Description must be less than 1000 characters";
  }

  if (data.prep_time && data.prep_time.length > 50) {
    errors.prep_time = "Prep time must be less than 50 characters";
  }

  if (data.instructions && data.instructions.length > 5000) {
    errors.instructions = "Instructions must be less than 5000 characters";
  }

  // Sell price is required for dishes (for profit/margin calculations)
  if (data.sell_price === undefined || data.sell_price === null) {
    errors.sell_price = "Sell price is required";
  } else if (data.sell_price <= 0) {
    errors.sell_price = "Sell price must be greater than 0";
  }

  return errors;
}

export function validateDishIngredient(
  data: DishIngredientFormData,
  index?: number
): ValidationErrors {
  const errors: ValidationErrors = {};
  const prefix = index !== undefined ? `ingredient_${index}_` : "";

  // Must have either inventory_id OR recipe_id, but not both
  if (!data.inventory_id && !data.recipe_id) {
    errors[`${prefix}ingredient`] = "Ingredient or recipe is required";
  }

  if (data.inventory_id && data.recipe_id) {
    errors[`${prefix}ingredient`] =
      "Ingredient cannot be both inventory and recipe";
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

export function validateDishWithIngredients(
  dishData: DishFormData,
  ingredients: DishIngredientFormData[]
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate dish data
  const dishErrors = validateDish(dishData);
  Object.assign(errors, dishErrors);

  // Validate ingredients
  ingredients.forEach((ingredient, index) => {
    const ingredientErrors = validateDishIngredient(ingredient, index);
    Object.assign(errors, ingredientErrors);
  });

  // Check for duplicate ingredients (either inventory or recipe)
  const allIngredientIds = ingredients.map((ing) =>
    ing.inventory_id
      ? `inv_${ing.inventory_id}`
      : ing.recipe_id
      ? `rec_${ing.recipe_id}`
      : null
  );

  const validIds = allIngredientIds.filter(Boolean);
  const duplicates = validIds.filter(
    (id, index) => validIds.indexOf(id) !== index
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
        return "Dish name is required";
      }
      if (typeof value === "string" && value.length > 255) {
        return "Dish name must be less than 255 characters";
      }
      break;

    case "description":
      if (typeof value === "string" && value.length > 1000) {
        return "Description must be less than 1000 characters";
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

    case "sell_price":
      if (value === null || value === undefined) {
        return "Sell price is required";
      }
      if (typeof value === "number" && value <= 0) {
        return "Sell price must be greater than 0";
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
