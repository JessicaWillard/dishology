import type { RecipeIngredientWithInventory } from "@/components/recipes-components/interface";

/**
 * Calculate the total cost of a recipe based on ingredients and their inventory prices
 */
export const calculateRecipeCost = (
  ingredients: RecipeIngredientWithInventory[]
): number => {
  return ingredients.reduce((total, ingredient) => {
    if (!ingredient.inventory?.price_per_unit) {
      return total;
    }

    const pricePerUnit = parseFloat(ingredient.inventory.price_per_unit);
    const inventorySize = parseFloat(ingredient.inventory.size || "1");
    const quantity = ingredient.quantity;

    // Skip invalid prices, sizes, or quantities
    if (isNaN(pricePerUnit) || isNaN(inventorySize) || isNaN(quantity)) {
      return total;
    }

    // Calculate cost per unit based on inventory size
    const costPerUnit = pricePerUnit / inventorySize;
    return total + costPerUnit * quantity;
  }, 0);
};

/**
 * Calculate cost per unit based on total recipe cost and number of units in batch
 */
export const calculateCostPerUnit = (
  totalCost: number,
  units: number
): number => {
  return units > 0 && !isNaN(totalCost) && !isNaN(units)
    ? totalCost / units
    : 0;
};

/**
 * Calculate number of units in a batch based on batch size and unit size
 * Example: 1L batch with 100ml units = 10 units
 */
export const calculateUnits = (batchSize: number, unitSize: number): number => {
  return unitSize > 0 && !isNaN(batchSize) && !isNaN(unitSize)
    ? Math.floor(batchSize / unitSize)
    : 0;
};
