import type { Nullable } from "../../utils/types/components";

export interface SupplierCardProps {
  supplierName: Nullable<string>;
  description: Nullable<string>;
  contactName: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  website: Nullable<string>;
}
