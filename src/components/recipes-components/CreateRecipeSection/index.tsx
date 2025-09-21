"use client";

import { useState, useCallback } from "react";
import { tv } from "tailwind-variants";
import type { CreateRecipeSectionProps } from "./interface";
import type { RecipeFormData } from "@/utils/types/database";
import { RecipeForm } from "../RecipeForm";
import { SidePanel } from "../../ui/SidePanel";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";

const createSectionStyles = tv({
  base: "flex flex-col gap-6",
});

export function CreateRecipeSection({
  onCreate,
  isCreating = false,
  availableInventory = [],
  isVisible = false,
  onClose,
  className,
}: CreateRecipeSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = useCallback(
    async (data: any) => {
      setIsSubmitting(true);
      try {
        // Extract the recipe form data from the transformed data
        const recipeFormData: RecipeFormData = {
          name: data.name,
          description: data.description,
          batch_size: data.batch_size,
          batch_unit: data.batch_unit,
          units: data.units,
          prep_time: data.prep_time,
          instructions: data.instructions,
          ingredients:
            data.ingredients?.map((ing: any) => ({
              inventory_id: ing.inventory_id,
              quantity: ing.quantity,
              unit: ing.unit,
            })) || [],
        };

        const result = await onCreate(recipeFormData);
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
            Add Recipe
          </Text>
          <Text variant="body" size="sm" className="text-gray-dark">
            Create a new recipe with ingredients, instructions, and cost
            calculations.
          </Text>
        </Box>

        <RecipeForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isSubmitting={isCreating || isSubmitting}
          submitLabel="Add Recipe"
          availableInventory={availableInventory}
        />
      </Box>
    </SidePanel>
  );
}

CreateRecipeSection.displayName = "CreateRecipeSection";
