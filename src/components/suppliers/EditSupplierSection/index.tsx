import { Button } from "../../ui/Button";
import { SupplierForm } from "../SupplierForm";
import type { Supplier, SupplierFormData } from "@/utils/types/database";

interface EditSupplierSectionProps {
  editingSupplier: Supplier | null;
  onUpdate: (id: string, data: Partial<SupplierFormData>) => Promise<Supplier>;
  onDelete: (id: string) => Promise<void>;
  onCancel: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function EditSupplierSection({
  editingSupplier,
  onUpdate,
  onDelete,
  onCancel,
  isUpdating,
  isDeleting,
}: EditSupplierSectionProps) {
  if (!editingSupplier) {
    return null;
  }

  const handleEditSuccess = () => {
    onCancel();
  };

  const handleEditError = (error: Error) => {
    console.error("Failed to update supplier:", error);
    alert(`Error updating supplier: ${error.message}`);
  };

  return (
    <div className="w-full rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Edit Supplier</h2>
        <Button variant="outline" handlePress={onCancel}>
          Cancel Edit
        </Button>
      </div>

      <SupplierForm
        mode="edit"
        initialData={editingSupplier}
        onSuccess={handleEditSuccess}
        onError={handleEditError}
        onCancel={onCancel}
        showCancel={true}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isLoading={isUpdating || isDeleting}
      />
    </div>
  );
}
