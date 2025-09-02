import type { Nullable } from "../../utils/types/components";

export interface SupplierCardProps {
  id?: string;
  supplierName: Nullable<string>;
  description: Nullable<string>;
  contactName: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  website: Nullable<string>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
