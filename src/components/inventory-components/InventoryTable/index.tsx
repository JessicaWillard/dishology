import type { InventoryTableProps } from "../interface";
import {
  inventoryTableStyles,
  inventoryTableHeaderStyles,
  inventoryTHeaderRowStyles,
} from "../theme";
import { InventoryRow } from "./InventoryRow";

export const InventoryTable = (props: InventoryTableProps) => {
  const { items, showHeader = true, onRowClick, type } = props;

  // Determine the header type based on items
  const getHeaderType = () => {
    if (type) {
      return type === "mixed" ? "default" : type;
    }

    if (items.length === 0) {
      return "default";
    }

    // Check if all items have the same type
    const firstItemType = items[0].type;
    const allSameType = items.every((item) => item.type === firstItemType);

    return allSameType ? firstItemType : "default";
  };

  const headerType = getHeaderType();

  return (
    <table className={inventoryTableStyles({ variant: headerType })}>
      {showHeader && (
        <thead>
          <tr className={inventoryTHeaderRowStyles({ variant: headerType })}>
            <th className={`${inventoryTableHeaderStyles()} rounded-tl-lg`}>
              Item
            </th>
            <th className={inventoryTableHeaderStyles()}>Size</th>
            <th className={inventoryTableHeaderStyles()}>Qty</th>
            <th className={inventoryTableHeaderStyles()}>Date</th>
            <th className={inventoryTableHeaderStyles()}>Unit</th>
            <th className={`${inventoryTableHeaderStyles()} rounded-tr-lg`}>
              Total
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {items.map((item) => (
          <InventoryRow key={item.id} {...item} onRowClick={onRowClick} />
        ))}
      </tbody>
    </table>
  );
};

InventoryTable.displayName = "InventoryTable";
