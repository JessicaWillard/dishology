"use client";

import { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliersQuery";
import { SuppliersList } from "@/components/suppliers/SuppliersList";
import { EditSupplierSection } from "@/components/suppliers/EditSupplierSection";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { SidePanel } from "@/components/ui/SidePanel";
import { ControlsBar } from "@/components/ui/ControlsBar";
import type { Supplier } from "@/utils/types/database";
import { Box } from "@/components/ui/Box";

interface SuppliersClientProps {
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SuppliersClient = ({ userId }: SuppliersClientProps) => {
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

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

  const handleCreateClick = () => {
    setIsCreatePanelOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreatePanelOpen(false);
  };

  const handleCloseCreatePanel = () => {
    setIsCreatePanelOpen(false);
  };

  const handleEdit = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setEditingSupplier(supplier);
      setIsEditPanelOpen(true);
    }
  };

  const handleCloseEditPanel = () => {
    setEditingSupplier(null);
    setIsEditPanelOpen(false);
  };

  return (
    <>
      <Box display="flexCol" gap={6}>
        {/* Controls Bar */}
        <ControlsBar
          primaryAction={{
            onPress: handleCreateClick,
            icon: "Plus",
            label: "Add supplier",
          }}
        />

        {/* Suppliers List */}
        <Box className="mt-28 lg:mt-32">
          <SuppliersList
            suppliers={suppliers}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onRetry={refetch}
          />
        </Box>
      </Box>

      {/* Create Supplier Side Panel */}
      <SidePanel
        isOpen={isCreatePanelOpen}
        onClose={handleCloseCreatePanel}
        width="half"
        position="right"
      >
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Create New Supplier</h2>
          </div>

          <SupplierForm
            mode="create"
            onSuccess={handleCreateSuccess}
            onError={(error: Error) => {
              alert(`Error creating supplier: ${error.message}`);
            }}
            onCreate={create}
            isLoading={isCreating}
          />
        </div>
      </SidePanel>

      {/* Edit Supplier Side Panel */}
      <SidePanel
        isOpen={isEditPanelOpen}
        onClose={handleCloseEditPanel}
        width="half"
        position="right"
      >
        {editingSupplier && (
          <EditSupplierSection
            editingSupplier={editingSupplier}
            onUpdate={update}
            onDelete={remove}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            onSuccess={handleCloseEditPanel}
          />
        )}
      </SidePanel>
    </>
  );
};
