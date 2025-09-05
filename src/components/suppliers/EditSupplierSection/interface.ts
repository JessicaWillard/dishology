import type { Supplier, SupplierFormData } from "@/utils/types/database";

export interface EditSupplierSectionProps {
  editingSupplier: Supplier | null;
  onUpdate: (id: string, data: Partial<SupplierFormData>) => Promise<Supplier>;
  onDelete: (id: string) => Promise<void>;
  onCancel: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}
