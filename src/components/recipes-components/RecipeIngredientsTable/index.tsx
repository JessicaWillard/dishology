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
          // Calculate cost per unit based on inventory size
          const pricePerUnit = parseFloat(ingredient.inventory.price_per_unit);
          const inventorySize = parseFloat(ingredient.inventory.size || "1");
          const costPerUnit = pricePerUnit / inventorySize;
          const totalCost = ingredient.quantity * costPerUnit;

          const handleRowClick = () => {
            if (onRowClick) {
              onRowClick(ingredient.inventory.id);
            }
          };

          return (
            <tr
              key={ingredient.id}
              className={clsx(
                recipeIngredientsTableRowStyles({
                  variant:
                    (ingredient.inventory.type as InventoryType) || "default",
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
                    {ingredient.inventory.name}
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
                  {ingredient.unit || ingredient.inventory.unit || ""}
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
