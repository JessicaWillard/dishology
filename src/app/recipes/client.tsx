"use client";

import { useState, useMemo, useCallback } from "react";
import { useRecipes } from "@/hooks/useRecipesQuery";
import { useInventory } from "@/hooks/useInventoryQuery";
import { useControlsBarHeight } from "@/hooks/useControlsBarHeight";
import {
  RecipesList,
  CreateRecipeSection,
  EditRecipeSection,
} from "@/components/recipes-components";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { ControlsBar } from "@/components/ui/ControlsBar";
import type {
  RecipeWithIngredients,
  RecipeFormData,
} from "@/utils/types/database";
import type { InventoryOption } from "@/components/recipes-components/interface";
import {
  calculateRecipeCost,
  calculateCostPerUnit,
} from "@/components/recipes-components/theme";

interface RecipeClientProps {
  userId: string;
}

// Filter inventory to only include items allowed for recipes
const ALLOWED_INVENTORY_TYPES = [
  "produce",
  "dry",
  "meat",
  "dairy",
  "beverage",
  "other",
];

export function RecipeClient({}: RecipeClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [editingRecipe, setEditingRecipe] =
    useState<RecipeWithIngredients | null>(null);

  // Get dynamic height for ControlsBar
  const {
    height: controlsBarHeight,
    controlsBarRef,
    forceUpdateHeight,
  } = useControlsBarHeight();

  const {
    recipes,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRecipes();

  const { inventory } = useInventory();

  // Filter inventory for recipe ingredients
  const availableInventory: InventoryOption[] = useMemo(() => {
    return (inventory || [])
      .filter((item) => ALLOWED_INVENTORY_TYPES.includes(item.type || "other"))
      .map((item) => ({
        id: item.id!,
        name: item.name,
        type: item.type || "other",
        unit: item.unit,
        price_per_unit: item.price_per_unit,
      }));
  }, [inventory]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      // Force height update when search changes
      setTimeout(forceUpdateHeight, 100);
    },
    [forceUpdateHeight]
  );

  const handleCreate = useCallback(
    async (data: RecipeFormData) => {
      return await create(data);
    },
    [create]
  );

  const handleEdit = useCallback((recipe: RecipeWithIngredients) => {
    setEditingRecipe(recipe);
  }, []);

  const handleUpdate = useCallback(
    async (id: string, data: Partial<RecipeFormData>) => {
      return await update(id, data);
    },
    [update]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id);
    },
    [remove]
  );

  const handleCloseCreatePanel = useCallback(() => {
    setShowCreatePanel(false);
  }, []);

  const handleCloseEditPanel = useCallback(() => {
    setEditingRecipe(null);
  }, []);

  const handleOpenCreatePanel = useCallback(() => {
    setShowCreatePanel(true);
  }, []);

  if (loading) {
    return (
      <Box display="flexCol" align="start" justify="start" padding="lg" gap={4}>
        <Text>Loading recipes...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flexCol" align="start" justify="start" padding="lg" gap={4}>
        <Text className="text-error">Error loading recipes: {error}</Text>
        <Button handlePress={() => refetch()}>Try Again</Button>
      </Box>
    );
  }

  return (
    <Box display="flexCol" gap={6}>
      {/* Controls Bar */}
      <ControlsBar
        ref={controlsBarRef}
        search={{
          placeholder: "Search recipes...",
          value: searchTerm,
          onChange: handleSearchChange,
        }}
        primaryAction={{
          onPress: handleOpenCreatePanel,
          icon: "Plus",
          label: "Add recipe",
        }}
      />

      {/* Content */}
      <Box
        display="flexCol"
        gap={6}
        style={{
          marginTop: `${controlsBarHeight + 16}px`, // Use the measured height + 16px spacing
        }}
      >
        <RecipesList
          recipes={recipes}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          onEdit={handleEdit}
          onRetry={refetch}
          onAddNew={handleOpenCreatePanel}
        />
      </Box>

      {/* Side Panels */}
      <CreateRecipeSection
        onCreate={handleCreate}
        isCreating={isCreating}
        availableInventory={availableInventory}
        isVisible={showCreatePanel}
        onClose={handleCloseCreatePanel}
      />

      <EditRecipeSection
        editingRecipe={editingRecipe}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        availableInventory={availableInventory}
        onClose={handleCloseEditPanel}
      />
    </Box>
  );
}

RecipeClient.displayName = "RecipeClient";
