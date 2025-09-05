import type { Supplier, SupplierFormData } from "@/utils/types/database";

export interface CreateSupplierSectionProps {
  onCreate: (data: SupplierFormData) => Promise<Supplier>;
  isCreating: boolean;
}
