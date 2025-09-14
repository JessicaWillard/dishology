import { SupplierForm } from "../SupplierForm";
import type { EditSupplierSectionProps } from "./interface";

export function EditSupplierSection({
  editingSupplier,
  onUpdate,
  onDelete,
  onSuccess,
  isUpdating,
  isDeleting,
}: EditSupplierSectionProps) {
  if (!editingSupplier) {
    return null;
  }

  const handleEditSuccess = () => {
    onSuccess?.();
  };

  const handleEditError = (error: Error) => {
    console.error("Failed to update supplier:", error);
    alert(`Error updating supplier: ${error.message}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Edit Supplier</h2>
      </div>

      <SupplierForm
        mode="edit"
        initialData={editingSupplier}
        onSuccess={handleEditSuccess}
        onError={handleEditError}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isLoading={isUpdating || isDeleting}
      />
    </div>
  );
}
