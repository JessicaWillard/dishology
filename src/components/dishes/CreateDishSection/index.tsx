"use client";

import { useCallback } from "react";
import { tv } from "tailwind-variants";
import type { CreateDishSectionProps } from "../interface";
import { DishForm } from "../DishForm";
import { SidePanel } from "../../ui/SidePanel";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";
import { useDishes } from "@/hooks/useDishesQuery";

const createSectionStyles = tv({
  base: "flex flex-col gap-6",
});

export function CreateDishSection({
  isOpen,
  onClose,
  availableInventory = [],
  availableRecipes = [],
}: CreateDishSectionProps) {
  const { create, isCreating } = useDishes();

  const handleFormSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
      try {
        await create(data);
        onClose?.();
      } catch (error) {
        console.error("Error creating dish:", error);
        // Error is handled by the mutation
      }
    },
    [create, onClose]
  );

  return (
    <SidePanel isOpen={isOpen} onClose={onClose || (() => {})}>
      <Box className={createSectionStyles()}>
        <Box>
          <Text variant="body" size="lg" weight="bold" className="mb-2">
            Add Dish
          </Text>
          <Text variant="body" size="sm" className="text-gray-dark">
            Create a new dish with ingredients, recipes, cost analysis, and
            profit calculations.
          </Text>
        </Box>

        <DishForm
          mode="create"
          onSubmit={handleFormSubmit}
          isSubmitting={isCreating}
          submitLabel="Add Dish"
          availableInventory={availableInventory}
          availableRecipes={availableRecipes}
          showCancel={false}
        />
      </Box>
    </SidePanel>
  );
}

CreateDishSection.displayName = "CreateDishSection";
