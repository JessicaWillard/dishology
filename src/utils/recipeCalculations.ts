import type { RecipeIngredientWithInventory } from "@/components/recipes-components/interface";

/**
 * Calculate the total cost of a recipe based on ingredients and their inventory prices
 */
export function calculateRecipeCost(
  ingredients: RecipeIngredientWithInventory[]
): number {
  return ingredients.reduce((total, ingredient) => {
    const inventoryPrice = parseFloat(ingredient.inventory.price_per_unit);
    const quantity = ingredient.quantity;

    // Skip invalid prices or quantities
    if (isNaN(inventoryPrice) || isNaN(quantity)) {
      return total;
    }

    return total + inventoryPrice * quantity;
  }, 0);
}

/**
 * Calculate cost per unit based on total recipe cost and number of units in batch
 */
export function calculateCostPerUnit(totalCost: number, units: number): number {
  if (units <= 0 || isNaN(totalCost) || isNaN(units)) {
    return 0;
  }

  return totalCost / units;
}

/**
 * Calculate number of units in a batch based on batch size and unit size
 * Example: 1L batch with 100ml units = 10 units
 */
export function calculateUnits(batchSize: number, unitSize: number): number {
  if (unitSize <= 0 || isNaN(batchSize) || isNaN(unitSize)) {
    return 0;
  }

  return Math.floor(batchSize / unitSize);
}

/**
 * Format currency value for display
 */
export function formatCurrency(value: number, currency = "USD"): string {
  if (isNaN(value)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calculate ingredient cost for display
 */
export function calculateIngredientCost(
  quantity: number,
  pricePerUnit: string | number
): number {
  const price =
    typeof pricePerUnit === "string" ? parseFloat(pricePerUnit) : pricePerUnit;

  if (isNaN(price) || isNaN(quantity)) {
    return 0;
  }

  return quantity * price;
}

/**
 * Validate batch size against unit size
 */
export function validateBatchSize(
  batchSize: number,
  unitSize: number
): {
  isValid: boolean;
  warning?: string;
} {
  if (isNaN(batchSize) || isNaN(unitSize)) {
    return { isValid: false };
  }

  if (batchSize <= 0 || unitSize <= 0) {
    return { isValid: false };
  }

  if (batchSize < unitSize) {
    return {
      isValid: true,
      warning:
        "Batch size is smaller than unit size. This will result in less than 1 unit per batch.",
    };
  }

  return { isValid: true };
}

/**
 * Calculate recipe nutrition or other metrics
 * Placeholder for future expansion
 */
export function calculateRecipeMetrics(
  ingredients: RecipeIngredientWithInventory[],
  batchSize: number,
  unitSize: number
) {
  const totalCost = calculateRecipeCost(ingredients);
  const units = calculateUnits(batchSize, unitSize);
  const costPerUnit = calculateCostPerUnit(totalCost, units);

  return {
    totalCost,
    units,
    costPerUnit,
    formattedTotalCost: formatCurrency(totalCost),
    formattedCostPerUnit: formatCurrency(costPerUnit),
    ingredientCount: ingredients.length,
  };
}

/**
 * Convert between common units (for future use)
 * This is a basic implementation - could be expanded significantly
 */
export function convertUnits(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  // Basic volume conversions
  const volumeConversions: Record<string, number> = {
    ml: 1,
    l: 1000,
    cup: 240,
    tsp: 5,
    tbsp: 15,
    fl_oz: 30,
    pt: 473,
    qt: 946,
    gal: 3785,
  };

  // Basic weight conversions
  const weightConversions: Record<string, number> = {
    g: 1,
    kg: 1000,
    oz: 28.35,
    lb: 453.59,
  };

  const normalizedFrom = fromUnit.toLowerCase().replace(/[^a-z]/g, "");
  const normalizedTo = toUnit.toLowerCase().replace(/[^a-z]/g, "");

  // Try volume conversion first
  if (volumeConversions[normalizedFrom] && volumeConversions[normalizedTo]) {
    const mlValue = value * volumeConversions[normalizedFrom];
    return mlValue / volumeConversions[normalizedTo];
  }

  // Try weight conversion
  if (weightConversions[normalizedFrom] && weightConversions[normalizedTo]) {
    const gramValue = value * weightConversions[normalizedFrom];
    return gramValue / weightConversions[normalizedTo];
  }

  // If no conversion available, return original value
  return value;
}
