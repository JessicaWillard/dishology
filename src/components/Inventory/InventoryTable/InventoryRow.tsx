import Icon from "../../ui/Icon";
import type { InventoryProps } from "../interface";
import {
  inventoryTableRowStyles,
  inventoryTableCellStyles,
  inventoryTableQuantityStyles,
  inventoryTableQuantityLowStyles,
} from "../theme";
import { useEffect, useState } from "react";
import { formatDateFromString } from "@/utils/date";

interface InventoryRowProps extends InventoryProps {
  onRowClick?: (id: string) => void;
}

export const InventoryRow = (props: InventoryRowProps) => {
  const {
    id,
    name,
    type,
    quantity,
    size,
    unit,
    pricePerUnit,
    countDate,
    minCount,
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
        {formatDateFromString(countDate)}
      </td>
      <td className={inventoryTableCellStyles({ variant: type })}>
        {pricePerUnit ? `$${parseFloat(pricePerUnit).toFixed(2)}` : "-"}
      </td>
      <td className={inventoryTableCellStyles({ variant: type })}>
        {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "-"}
      </td>
      {isLow && (
        <Icon name="LowStock" className={inventoryTableQuantityLowStyles()} />
      )}
    </tr>
  );
};

InventoryRow.displayName = "InventoryRow";
