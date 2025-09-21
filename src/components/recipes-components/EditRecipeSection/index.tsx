"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Button } from "../../ui/Button";

const editSectionStyles = tv({
  base: "flex flex-col gap-6",
});

export function EditRecipeSection({
  editingRecipe,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  availableInventory = [],
  onClose,
  className,
}: EditRecipeSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

        const result = await onUpdate(editingRecipe.id, recipeFormData);
        onClose?.();
        return result;
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
      setShowDeleteDialog(false);
      onClose?.();
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Error deleting recipe:", error);
    }
  }, [editingRecipe?.id, onDelete, onClose]);

  const handleCancel = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  // Reset delete dialog when editingRecipe changes
  useEffect(() => {
    if (!editingRecipe) {
      setShowDeleteDialog(false);
    }
  }, [editingRecipe]);

  return (
    <>
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
              initialData={editingRecipe}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isSubmitting={isUpdating || isSubmitting}
              submitLabel="Update Recipe"
              availableInventory={availableInventory}
            />

            <Box className="border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                handlePress={handleDeleteConfirm}
                disabled={isDeleting || isSubmitting}
                className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                {isDeleting ? "Deleting..." : "Delete Recipe"}
              </Button>
            </Box>
          </Box>
        )}
      </SidePanel>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Recipe
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{editingRecipe?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                handlePress={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                handlePress={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

EditRecipeSection.displayName = "EditRecipeSection";
