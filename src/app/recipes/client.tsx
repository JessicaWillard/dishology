"use client";

import { useState, useMemo, useCallback } from "react";
import { useRecipes } from "@/hooks/useRecipesQuery";
import { useInventory } from "@/hooks/useInventoryQuery";
import { useSuppliersQuery } from "@/hooks/useSuppliersQuery";
import { useControlsBarHeight } from "@/hooks/useControlsBarHeight";
import {
  RecipesList,
  CreateRecipeSection,
  EditRecipeSection,
} from "@/components/recipes-components";
import { EditInventorySection } from "@/components/inventory-components/EditInventorySection";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { ControlsBar } from "@/components/ui/ControlsBar";
import type {
  RecipeWithIngredients,
  RecipeFormData,
  InventoryWithSupplier,
  InventoryFormData,
} from "@/utils/types/database";
import type { InventoryOption } from "@/components/recipes-components/interface";
import { formatDateForInput } from "@/utils/date";

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
  const [editingInventoryItem, setEditingInventoryItem] =
    useState<InventoryWithSupplier | null>(null);

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

  const {
    inventory,
    update: updateInventory,
    remove: removeInventory,
    isUpdating: isUpdatingInventory,
    isDeleting: isDeletingInventory,
  } = useInventory();

  const { data: suppliers = [] } = useSuppliersQuery();

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

  const handleIngredientClick = useCallback(
    (inventoryId: string) => {
      const item = inventory?.find((i) => i.id === inventoryId);
      if (item) {
        // Transform the item to have the correct date format for the form
        const editingItem = {
          ...item,
          count_date: formatDateForInput(item.count_date),
        };
        setEditingInventoryItem(editingItem);
      }
    },
    [inventory]
  );

  const handleUpdateInventory = useCallback(
    async (id: string, data: Partial<InventoryFormData>) => {
      return await updateInventory(id, data);
    },
    [updateInventory]
  );

  const handleDeleteInventory = useCallback(
    async (id: string) => {
      await removeInventory(id);
    },
    [removeInventory]
  );

  const handleCloseInventoryPanel = useCallback(() => {
    setEditingInventoryItem(null);
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
          onIngredientClick={handleIngredientClick}
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

      <EditInventorySection
        editingItem={editingInventoryItem}
        onUpdate={handleUpdateInventory}
        onDelete={handleDeleteInventory}
        isUpdating={isUpdatingInventory}
        isDeleting={isDeletingInventory}
        suppliers={suppliers
          .filter((s) => s.id)
          .map((s) => ({ id: s.id!, name: s.name }))}
        onClose={handleCloseInventoryPanel}
      />
    </Box>
  );
}

RecipeClient.displayName = "RecipeClient";
