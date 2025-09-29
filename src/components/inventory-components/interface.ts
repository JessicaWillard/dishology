import type { Nullable } from "../../utils/types/components";
import type { SupplierContact } from "../../utils/types/database";

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
  name: string;
  type: InventoryType;
  description?: Nullable<string>;
  quantity: string;
  size?: Nullable<string>;
  unit?: Nullable<string>;
  pricePerUnit: string;
  pricePerPack?: Nullable<string>;
  supplier?: {
    id: string;
    name: string;
    contact: SupplierContact;
  } | null;
  location?: Nullable<string>;
  minCount?: Nullable<string>;
  countDate: string;
  onEdit?: (id: string) => void;
}

export interface InventoryTableProps {
  items: InventoryProps[];
  showHeader?: boolean;
  onRowClick?: (id: string) => void;
  type?: InventoryType | "mixed";
}
