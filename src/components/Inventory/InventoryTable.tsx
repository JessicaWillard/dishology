import Icon from "../Icon";
import type { InventoryTableProps } from "./interface";
import {
  inventoryTableStyles,
  inventoryTableHeaderStyles,
  inventoryTableRowStyles,
  inventoryTableCellStyles,
  inventoryTableQuantityStyles,
  inventoryTHeaderRowStyles,
  inventoryTableQuantityLowStyles,
} from "./theme";
import { useEffect, useState } from "react";

export const InventoryTable = (props: InventoryTableProps) => {
  const {
    id,
    name,
    type = "default",
    quantity,
    size,
    unit,
    pricePerUnit,
    countDate,
    minCount,
    showHeader = true,
    onRowClick,
  } = props;

  const [isLow, setIsLow] = useState(false);
  const lowStock = parseFloat(quantity) <= parseFloat(minCount || "0");

  useEffect(() => {
    setIsLow(lowStock);
  }, [lowStock]);

  const totalPrice = pricePerUnit
    ? parseFloat(pricePerUnit) * parseFloat(quantity)
    : 0;

  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(id);
    }
  };

  return (
    <table className={inventoryTableStyles({ variant: type })}>
      {showHeader && (
        <thead>
          <tr className={inventoryTHeaderRowStyles({ variant: type })}>
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
        <tr
          className={inventoryTableRowStyles({
            variant: type,
            clickable: !!onRowClick,
          })}
          onClick={handleRowClick}
        >
          <td className={inventoryTableCellStyles({ variant: type })}>
            <div>{name && <div className="font-medium">{name}</div>}</div>
          </td>
          <td className={inventoryTableCellStyles({ variant: type })}>
            {size && unit ? `${parseFloat(size)} ${unit}` : "-"}
          </td>
          <td
            className={inventoryTableCellStyles({
              variant: type,
            })}
          >
            <span className={inventoryTableQuantityStyles({ variant: type })}>
              {parseFloat(quantity)}
            </span>
          </td>
          <td className={inventoryTableCellStyles({ variant: type })}>
            {countDate ? countDate.toString() : "-"}
          </td>
          <td className={inventoryTableCellStyles({ variant: type })}>
            {pricePerUnit ? `$${parseFloat(pricePerUnit).toFixed(2)}` : "-"}
          </td>
          <td className={inventoryTableCellStyles({ variant: type })}>
            {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "-"}
          </td>
          {isLow && (
            <Icon
              name="LowStock"
              className={inventoryTableQuantityLowStyles()}
            />
          )}
        </tr>
      </tbody>
    </table>
  );
};

InventoryTable.displayName = "InventoryTable";
