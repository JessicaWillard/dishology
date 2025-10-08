"use client";

import { useCallback } from "react";
import { tv } from "tailwind-variants";
import type { EditDishSectionProps } from "../interface";
import { DishForm } from "../DishForm";
import { SidePanel } from "../../ui/SidePanel";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";
import { useDishQuery, useDishes } from "@/hooks/useDishesQuery";

const editSectionStyles = tv({
  base: "flex flex-col gap-6",
});

export function EditDishSection({
  isOpen,
  onClose,
  dishId,
  availableInventory = [],
  availableRecipes = [],
}: EditDishSectionProps) {
  // Fetch the dish data
  const { data: editingDish, isLoading } = useDishQuery(dishId);
  const { update, remove, isUpdating, isDeleting } = useDishes();

  const handleFormSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
      if (!dishId) return;

      try {
        await update(dishId, data);
        onClose?.();
      } catch (error) {
        console.error("Error updating dish:", error);
      }
    },
    [dishId, update, onClose]
  );

  const handleDelete = useCallback(async () => {
    if (!dishId) return;

    try {
      await remove(dishId);
      onClose?.();
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  }, [dishId, remove, onClose]);

  return (
    <SidePanel isOpen={isOpen} onClose={onClose || (() => {})}>
      {isOpen && (
        <>
          {isLoading ? (
            <Box className={editSectionStyles()}>
              <Text>Loading...</Text>
            </Box>
          ) : editingDish ? (
            <Box className={editSectionStyles()}>
              <Box>
                <Text variant="body" size="lg" weight="bold" className="mb-2">
                  Edit Dish
                </Text>
                <Text variant="body" size="sm" className="text-gray-dark">
                  Update dish details, ingredients, and pricing.
                </Text>
              </Box>

              <DishForm
                mode="edit"
                initialData={editingDish}
                onSubmit={handleFormSubmit}
                onDelete={handleDelete}
                isSubmitting={isUpdating || isDeleting}
                submitLabel="Update Dish"
                availableInventory={availableInventory}
                availableRecipes={availableRecipes}
                showCancel={false}
              />
            </Box>
          ) : null}
        </>
      )}
    </SidePanel>
  );
}

EditDishSection.displayName = "EditDishSection";
