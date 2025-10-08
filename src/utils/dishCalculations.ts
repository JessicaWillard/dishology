import type { RecipeWithIngredients } from "@/utils/types/database";
import type { RecipeIngredientWithInventory } from "@/components/recipes-components/interface";
import { calculateRecipeCost } from "@/utils/recipeCalculations";

/**
 * Dish ingredient with either inventory or recipe details
 */
export interface DishIngredientWithDetails {
  id: string;
  quantity: number;
  unit?: string | null;
  inventory_id?: string | null;
  recipe_id?: string | null;
  inventory?: {
    id: string;
    name: string;
    price_per_unit: string;
    size?: string | null;
    type?: string | null;
    unit?: string | null;
  } | null;
  recipe?: RecipeWithIngredients | null;
}

/**
 * Calculate the cost of a single inventory item ingredient
 */
const calculateInventoryItemCost = (
  quantity: number,
  pricePerUnit: string,
  size?: string | null
): number => {
  const price = parseFloat(pricePerUnit);
  const inventorySize = parseFloat(size || "1");

  // Skip invalid prices, sizes, or quantities
  if (
    isNaN(price) ||
    isNaN(inventorySize) ||
    isNaN(quantity) ||
    price <= 0 ||
    inventorySize <= 0
  ) {
    return 0;
  }

  // Calculate cost per smallest unit: price_per_unit is for the entire inventory.size
  const costPerSmallestUnit = price / inventorySize;
  return costPerSmallestUnit * quantity;
};

/**
 * Calculate the cost per unit of a recipe based on its total cost and units produced
 */
export const calculateRecipeCostPerUnit = (
  recipe: RecipeWithIngredients
): number => {
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return 0;
  }

  // Map recipe ingredients to the format expected by calculateRecipeCost
  const recipeIngredients: RecipeIngredientWithInventory[] =
    recipe.ingredients.map((ing) => ({
      id: ing.id || "",
      quantity: ing.quantity,
      unit: ing.unit,
      inventory: ing.inventory
        ? {
            id: ing.inventory.id,
            name: ing.inventory.name,
            price_per_unit: ing.inventory.price_per_unit,
            type: ing.inventory.type || null,
            unit: ing.inventory.unit,
            size: ing.inventory.size,
          }
        : {
            id: "",
            name: "",
            price_per_unit: "0",
            type: null,
            unit: null,
            size: null,
          },
    }));

  const totalRecipeCost = calculateRecipeCost(recipeIngredients);
  const units = recipe.units || 0;

  return units > 0 && !isNaN(totalRecipeCost) ? totalRecipeCost / units : 0;
};

/**
 * Calculate the total cost of a dish from its mixed ingredients (inventory + recipes)
 */
export const calculateDishCost = (
  ingredients: DishIngredientWithDetails[]
): number => {
  return ingredients.reduce((total, ingredient) => {
    // Inventory item
    if (ingredient.inventory_id && ingredient.inventory) {
      const cost = calculateInventoryItemCost(
        ingredient.quantity,
        ingredient.inventory.price_per_unit,
        ingredient.inventory.size
      );
      return total + cost;
    }

    // Recipe item
    if (ingredient.recipe_id && ingredient.recipe) {
      const recipeCostPerUnit = calculateRecipeCostPerUnit(ingredient.recipe);
      return total + recipeCostPerUnit * ingredient.quantity;
    }

    return total;
  }, 0);
};

/**
 * Calculate profit from sell price and cost
 * Profit = Sell Price - Cost
 */
export const calculateProfit = (sellPrice: number, cost: number): number => {
  if (isNaN(sellPrice) || isNaN(cost)) {
    return 0;
  }
  return sellPrice - cost;
};

/**
 * Calculate profit margin as a percentage
 * Margin = (Profit / Sell Price) × 100
 */
export const calculateMargin = (profit: number, sellPrice: number): number => {
  if (isNaN(profit) || isNaN(sellPrice) || sellPrice <= 0) {
    return 0;
  }
  return (profit / sellPrice) * 100;
};

/**
 * Calculate all dish metrics at once
 */
export const calculateDishMetrics = (
  ingredients: DishIngredientWithDetails[],
  sellPrice: number
) => {
  const cost = calculateDishCost(ingredients);
  const profit = calculateProfit(sellPrice, cost);
  const margin = calculateMargin(profit, sellPrice);

  return {
    cost,
    profit,
    margin,
  };
};
