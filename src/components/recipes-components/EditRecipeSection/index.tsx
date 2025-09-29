"use client";

import { useState, useCallback } from "react";
import { tv } from "tailwind-variants";
import type { EditRecipeSectionProps } from "./interface";
import type {
  RecipeFormData,
  RecipeIngredientFormData,
} from "@/utils/types/database";
import { RecipeForm } from "../RecipeForm";
import { SidePanel } from "../../ui/SidePanel";
import { Box } from "../../ui/Box";
import { Text } from "../../ui/Text";

const editSectionStyles = tv({
  base: "flex flex-col gap-6",
});

export function EditRecipeSection({
  editingRecipe,
  onUpdate,
  onDelete,
  isUpdating = false,
  availableInventory = [],
  onClose,
  className,
}: EditRecipeSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVisible = Boolean(editingRecipe);

  const handleFormSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
      if (!editingRecipe?.id) return;

      setIsSubmitting(true);
      try {
        // Extract the recipe form data from the transformed data
        const recipeFormData: Partial<RecipeFormData> = {
          name: data.name,
          description: data.description,
          batch_size: data.batch_size,
          batch_unit: data.batch_unit,
          units: data.units,
          prep_time: data.prep_time,
          instructions: data.instructions,
          ingredients:
            data.ingredients?.map((ing: RecipeIngredientFormData) => ({
              inventory_id: ing.inventory_id,
              quantity: ing.quantity,
              unit: ing.unit,
            })) || [],
        };

        await onUpdate(editingRecipe.id, recipeFormData);
        onClose?.();
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingRecipe?.id, onUpdate, onClose]
  );

  const handleDelete = useCallback(async () => {
    if (!editingRecipe?.id) return;

    try {
      await onDelete(editingRecipe.id);
      onClose?.();
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Error deleting recipe:", error);
    }
  }, [editingRecipe?.id, onDelete, onClose]);

  return (
    <SidePanel
      isOpen={isVisible}
      onClose={onClose || (() => {})}
      className={className}
    >
      {editingRecipe && (
        <Box className={editSectionStyles()}>
          <Box>
            <Text variant="body" size="lg" weight="bold" className="mb-2">
              Edit Recipe
            </Text>
            <Text variant="body" size="sm" className="text-gray-dark">
              Update recipe details, ingredients, and instructions.
            </Text>
          </Box>

          <RecipeForm
            mode="edit"
            initialData={editingRecipe}
            onSubmit={handleFormSubmit}
            onDelete={handleDelete}
            isSubmitting={isUpdating || isSubmitting}
            submitLabel="Update Recipe"
            availableInventory={availableInventory}
            showCancel={false}
          />
        </Box>
      )}
    </SidePanel>
  );
}

EditRecipeSection.displayName = "EditRecipeSection";
