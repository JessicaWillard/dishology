"use client";

import type { DishIngredientsTableProps } from "../interface";
import type { InventoryType } from "@/utils/types/database";
import { Text } from "../../ui/Text";
import {
  dishTableStyles,
  dishTableHeaderStyles,
  dishTableRowStyles,
  dishTableCellStyles,
} from "../theme";
import { clsx } from "clsx";
import { calculateRecipeCostPerUnit } from "@/utils/dishCalculations";

export const DishIngredientsTable = (props: DishIngredientsTableProps) => {
  const { ingredients, showHeader = true, onRowClick } = props;

  if (ingredients.length === 0) {
    return (
      <Text size="sm" className="text-gray-500 italic">
        No ingredients added yet.
      </Text>
    );
  }

  return (
    <table className={clsx(dishTableStyles())}>
      {showHeader && (
        <thead>
          <tr className="bg-gray-dark">
            <th className={clsx(dishTableHeaderStyles())}>Item</th>
            <th className={clsx(dishTableHeaderStyles())}>Qty</th>
            <th className={clsx(dishTableHeaderStyles(), "text-right")}>
              Total Cost
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {ingredients.map((ingredient, index) => {
          const isInventoryItem =
            "inventory_id" in ingredient && ingredient.inventory_id;
          const isRecipeItem =
            "recipe_id" in ingredient && ingredient.recipe_id;

          let itemName = "Unknown Item";
          let itemType: string = "default";
          let totalCost = 0;
          const quantity = ingredient.quantity;
          let unit = "";

          // Handle inventory item
          if (isInventoryItem && ingredient.inventory) {
            itemName = ingredient.inventory.name;
            itemType = ingredient.inventory.type || "default";

            // Calculate cost for inventory item
            const pricePerUnit = parseFloat(
              ingredient.inventory.price_per_unit || "0"
            );
            const inventorySize = parseFloat(ingredient.inventory.size || "1");

            if (
              !isNaN(pricePerUnit) &&
              !isNaN(inventorySize) &&
              pricePerUnit > 0 &&
              inventorySize > 0
            ) {
              const costPerSmallestUnit = pricePerUnit / inventorySize;
              totalCost = ingredient.quantity * costPerSmallestUnit;
            }

            // Use current inventory unit, fall back to stored unit
            unit = ingredient.inventory.unit || ingredient.unit || "";
          }
          // Handle recipe item
          else if (isRecipeItem && ingredient.recipe) {
            itemName = ingredient.recipe.name;
            itemType = "recipe";

            // Calculate cost for recipe item
            const recipeCostPerUnit = calculateRecipeCostPerUnit(
              ingredient.recipe
            );
            totalCost = ingredient.quantity * recipeCostPerUnit;

            // Use "U/M" for recipes, fall back to stored unit
            unit = "U/M";
          } else {
            // Fallback for items without inventory or recipe data
            unit = ingredient.unit || "";
          }

          const handleRowClick = () => {
            if (onRowClick) {
              const inventoryId =
                isInventoryItem && ingredient.inventory
                  ? ingredient.inventory.id
                  : undefined;
              const recipeId =
                isRecipeItem && ingredient.recipe
                  ? ingredient.recipe.id
                  : undefined;
              onRowClick(inventoryId, recipeId);
            }
          };

          return (
            <tr
              key={ingredient.id || `ingredient-${index}`}
              className={clsx(
                dishTableRowStyles({
                  type: itemType as InventoryType | "recipe" | "default",
                  clickable: !!onRowClick,
                })
              )}
              onClick={handleRowClick}
            >
              <td className={clsx(dishTableCellStyles({ align: "left" }))}>
                <Text size="sm" weight="medium">
                  {itemName}
                </Text>
              </td>
              <td className={clsx(dishTableCellStyles({ align: "left" }))}>
                <Text size="sm">
                  {quantity}
                  {unit}
                </Text>
              </td>
              <td className={clsx(dishTableCellStyles({ align: "right" }))}>
                <Text size="sm" weight="medium">
                  ${totalCost.toFixed(2)}
                </Text>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

DishIngredientsTable.displayName = "DishIngredientsTable";
