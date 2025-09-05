"use client";

import { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliersQuery";
import { SuppliersList } from "@/components/suppliers/SuppliersList";
import { CreateSupplierSection } from "@/components/suppliers/CreateSupplierSection";
import { EditSupplierSection } from "@/components/suppliers/EditSupplierSection";
import type { Supplier } from "@/utils/types/database";

interface SuppliersClientProps {
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SuppliersClient = ({ userId }: SuppliersClientProps) => {
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const {
    suppliers,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSuppliers();

  const handleEdit = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setEditingSupplier(supplier);
    }
  };

  const handleEditCancel = () => {
    setEditingSupplier(null);
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      {/* Create Supplier Section */}
      <CreateSupplierSection onCreate={create} isCreating={isCreating} />

      {/* Edit Supplier Section */}
      <EditSupplierSection
        editingSupplier={editingSupplier}
        onUpdate={update}
        onDelete={remove}
        onCancel={handleEditCancel}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {/* Suppliers List */}
      <SuppliersList
        suppliers={suppliers}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onRetry={refetch}
      />
    </div>
  );
};
