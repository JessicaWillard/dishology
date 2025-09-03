import type { Nullable } from "../../utils/types/components";
import type { CalendarDate } from "@internationalized/date";

export type InventoryType =
  | "produce"
  | "dry"
  | "meat"
  | "dairy"
  | "beverage"
  | "cleaning"
  | "smallwares"
  | "equipment"
  | "other";

export interface InventoryProps {
  id: string;
  name: Nullable<string>;
  type: InventoryType;
  description: Nullable<string>;
  quantity: string;
  size: Nullable<string>;
  unit: Nullable<string>;
  pricePerUnit: Nullable<string>;
  pricePerPack: Nullable<string>;
  supplier: Nullable<string>;
  location: Nullable<string>;
  minCount: Nullable<string>;
  countDate: CalendarDate;
  onEdit?: (id: string) => void;
}
