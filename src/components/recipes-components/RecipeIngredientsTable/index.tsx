import type { RecipeIngredientsTableProps } from "../interface";
import type { InventoryType } from "@/utils/types/database";
import { Text } from "../../ui/Text";
import {
  recipeIngredientsTableStyles,
  recipeIngredientsTableHeaderStyles,
  recipeIngredientsTableRowStyles,
  recipeIngredientsTableCellStyles,
} from "../theme";
import { clsx } from "clsx";

export const RecipeIngredientsTable = (props: RecipeIngredientsTableProps) => {
  const { ingredients, showHeader = true, onRowClick } = props;

  if (ingredients.length === 0) {
    return (
      <Text size="sm" className="text-gray-500 italic">
        No ingredients added yet.
      </Text>
    );
  }

  return (
    <table className={clsx(recipeIngredientsTableStyles())}>
      {showHeader && (
        <thead>
          <tr>
            <th className={clsx(recipeIngredientsTableHeaderStyles())}>Item</th>
            <th className={clsx(recipeIngredientsTableHeaderStyles())}>Qty</th>
            <th className={clsx(recipeIngredientsTableHeaderStyles())}>
              Total
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {ingredients.map((ingredient) => {
          // Safety check: ensure inventory data exists
          if (!ingredient.inventory) {
            console.warn("Ingredient missing inventory data:", ingredient);
            return null;
          }

          // Calculate total cost: price_per_unit is for the entire inventory.size quantity
          const pricePerUnit = parseFloat(
            ingredient.inventory.price_per_unit || "0"
          );
          const inventorySize = parseFloat(ingredient.inventory.size || "1");

          let totalCost = 0;
          if (
            !isNaN(pricePerUnit) &&
            !isNaN(inventorySize) &&
            pricePerUnit > 0 &&
            inventorySize > 0
          ) {
            // Calculate cost per smallest unit (e.g., per ml, per gram)
            const costPerSmallestUnit = pricePerUnit / inventorySize;
            totalCost = ingredient.quantity * costPerSmallestUnit;
          }

          const handleRowClick = () => {
            if (onRowClick && ingredient.inventory?.id) {
              onRowClick(ingredient.inventory.id);
            }
          };

          return (
            <tr
              key={ingredient.id}
              className={clsx(
                recipeIngredientsTableRowStyles({
                  variant:
                    (ingredient.inventory?.type as InventoryType) || "default",
                  clickable: !!onRowClick,
                })
              )}
              onClick={handleRowClick}
            >
              <td
                className={clsx(
                  recipeIngredientsTableCellStyles({ width: "name" })
                )}
              >
                <div>
                  <Text size="sm" weight="medium">
                    {ingredient.inventory?.name || "Unknown Item"}
                  </Text>
                </div>
              </td>
              <td
                className={clsx(
                  recipeIngredientsTableCellStyles({ width: "quantity" })
                )}
              >
                <Text size="sm">
                  {ingredient.quantity}
                  {ingredient.unit || ingredient.inventory?.unit || ""}
                </Text>
              </td>
              <td
                className={clsx(
                  recipeIngredientsTableCellStyles({
                    width: "total",
                    align: "right",
                  })
                )}
              >
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

RecipeIngredientsTable.displayName = "RecipeIngredientsTable";
