"use client";

import { useState, useCallback } from "react";
import { tv } from "tailwind-variants";
import type { EditInventorySectionProps } from "./interface";
import type { InventoryFormData } from "@/utils/types/database";
import { InventoryForm } from "../InventoryForm";
import { SidePanel } from "../../ui/SidePanel";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";

const editSectionStyles = tv({
  base: "flex flex-col gap-6",
});

export function EditInventorySection({
  editingItem,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  suppliers = [],
  onClose,
  className,
}: EditInventorySectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = useCallback(
    async (id: string, data: Partial<InventoryFormData>) => {
      setIsSubmitting(true);
      try {
        const result = await onUpdate(id, data);
        onClose?.();
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onUpdate, onClose]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      try {
        await onDelete(id);
        onClose?.();
      } finally {
        setIsSubmitting(false);
      }
    },
    [onDelete, onClose]
  );

  const handleSuccess = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const isVisible = !!editingItem;
  const isLoading = isUpdating || isDeleting || isSubmitting;

  return (
    <SidePanel
      isOpen={isVisible}
      onClose={onClose || (() => {})}
      className={className}
    >
      <Box className={editSectionStyles()}>
        <Box>
          <Text variant="body" size="lg" weight="bold" className="mb-2">
            {editingItem ? `Edit ${editingItem.name}` : "Edit Inventory Item"}
          </Text>
          <Text variant="body" size="sm" className="text-gray-dark">
            Update the inventory item details, pricing, and supplier
            information.
          </Text>
        </Box>

        {editingItem && (
          <InventoryForm
            mode="edit"
            initialData={editingItem}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            suppliers={suppliers}
            isLoading={isLoading}
            showCancel={false}
            submitText="Update Item"
            createSupplierUrl={"/suppliers"}
          />
        )}
      </Box>
    </SidePanel>
  );
}

EditInventorySection.displayName = "EditInventorySection";
