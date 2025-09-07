import Icon from "../../ui/Icon";
import type { InventoryProps } from "../interface";
import {
  inventoryTableRowStyles,
  inventoryTableCellStyles,
  inventoryTableQuantityStyles,
  inventoryTableQuantityLowStyles,
} from "../theme";
import { useState } from "react";
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

  const lowStock = parseFloat(quantity) <= parseFloat(minCount || "0");
  const [isLow, setIsLow] = useState(lowStock);

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
      <td
        className={inventoryTableCellStyles({ variant: type, width: "name" })}
      >
        <div>{name && <div className="font-medium">{name}</div>}</div>
      </td>
      <td className={inventoryTableCellStyles({ variant: type })}>
        {size && unit ? `${parseFloat(size)} ${unit}` : "-"}
      </td>
      <td
        className={inventoryTableCellStyles({
          variant: type,
          width: "quantity",
          // align: "center",
        })}
      >
        <span className={inventoryTableQuantityStyles({ variant: type })}>
          {parseFloat(quantity)}
        </span>
      </td>
      <td
        className={inventoryTableCellStyles({ variant: type, width: "date" })}
      >
        {formatDateFromString(countDate)}
      </td>
      <td className={inventoryTableCellStyles({ variant: type })}>
        {pricePerUnit ? `$${parseFloat(pricePerUnit).toFixed(2)}` : "-"}
      </td>
      <td
        className={`${inventoryTableCellStyles({
          variant: type,
        })} pr-4`}
      >
        <div className="relative">
          {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "-"}
          {isLow && (
            <Icon
              name="LowStock"
              className={inventoryTableQuantityLowStyles()}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

InventoryRow.displayName = "InventoryRow";
