"use client";

import { useState, useCallback } from "react";
import { tv } from "tailwind-variants";
import type { CreateInventorySectionProps } from "./interface";
import type { InventoryFormData } from "@/utils/types/database";
import { InventoryForm } from "../InventoryForm";
import { SidePanel } from "../../ui/SidePanel";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";

const createSectionStyles = tv({
  base: "flex flex-col gap-6",
});

export function CreateInventorySection({
  onCreate,
  isCreating = false,
  suppliers = [],
  isVisible = false,
  onClose,
  className,
}: CreateInventorySectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (data: InventoryFormData) => {
      setIsSubmitting(true);
      try {
        const result = await onCreate(data);
        onClose?.();
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onCreate, onClose]
  );

  const handleSuccess = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleCancel = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <SidePanel
      isOpen={isVisible}
      onClose={onClose || (() => {})}
      className={className}
    >
      <Box className={createSectionStyles()}>
        <Box>
          <Text variant="body" size="lg" weight="bold" className="mb-2">
            Add Inventory Item
          </Text>
          <Text variant="body" size="sm" className="text-gray-600">
            Add a new inventory item to track your stock levels, pricing, and
            supplier information.
          </Text>
        </Box>

        <InventoryForm
          mode="create"
          onCreate={handleCreate}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          suppliers={suppliers}
          isLoading={isCreating || isSubmitting}
          showCancel={true}
          submitText="Add Item"
        />
      </Box>
    </SidePanel>
  );
}

CreateInventorySection.displayName = "CreateInventorySection";
