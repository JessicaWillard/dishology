"use client";

import { useState, useMemo, useCallback } from "react";
import { useDishes } from "@/hooks/useDishesQuery";
import { useInventory } from "@/hooks/useInventoryQuery";
import { useRecipesQuery } from "@/hooks/useRecipesQuery";
import { useControlsBarHeight } from "@/hooks/useControlsBarHeight";
import { DishesList } from "@/components/dishes/DishesList";
import { CreateDishSection } from "@/components/dishes/CreateDishSection";
import { EditDishSection } from "@/components/dishes/EditDishSection";
import { EditInventorySection } from "@/components/inventory-components/EditInventorySection";
import { EditRecipeSection } from "@/components/recipes-components/EditRecipeSection";
import { Button } from "@/components/ui/Button";
import { Box } from "@/components/ui/Box";
import { Text } from "@/components/ui/Text";
import { ControlsBar } from "@/components/ui/ControlsBar";
import type {
  DishFormData,
  InventoryWithSupplier,
  InventoryFormData,
  RecipeWithIngredients,
  RecipeFormData,
} from "@/utils/types/database";
import type {
  InventoryOption,
  RecipeOption,
} from "@/components/dishes/interface";
import { formatDateForInput } from "@/utils/date";
import { calculateRecipeCostPerUnit } from "@/utils/dishCalculations";
import { useSuppliersQuery } from "@/hooks/useSuppliersQuery";

interface DishClientProps {
  userId: string;
}

// Filter inventory to only include items allowed for dishes
const ALLOWED_INVENTORY_TYPES = [
  "produce",
  "dry",
  "meat",
  "dairy",
  "beverage",
  "other",
];

export function DishClient({}: DishClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string>("");
  const [editingInventoryItem, setEditingInventoryItem] =
    useState<InventoryWithSupplier | null>(null);
  const [editingRecipe, setEditingRecipe] =
    useState<RecipeWithIngredients | null>(null);

  // Get dynamic height for ControlsBar
  const {
    height: controlsBarHeight,
    controlsBarRef,
    forceUpdateHeight,
  } = useControlsBarHeight();

  const {
    dishes,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  } = useDishes();

  const {
    inventory,
    update: updateInventory,
    remove: removeInventory,
    isUpdating: isUpdatingInventory,
    isDeleting: isDeletingInventory,
  } = useInventory();

  const {
    data: recipes = [],
    update: updateRecipe,
    remove: removeRecipe,
    isUpdating: isUpdatingRecipe,
    isDeleting: isDeletingRecipe,
  } = useRecipesQuery();

  const { data: suppliers = [] } = useSuppliersQuery();

  // Filter inventory for dish ingredients
  const availableInventory: InventoryOption[] = useMemo(() => {
    return (inventory || [])
      .filter((item) => ALLOWED_INVENTORY_TYPES.includes(item.type || "other"))
      .map((item) => ({
        id: item.id!,
        name: item.name,
        type: item.type || "other",
        unit: item.unit,
        price_per_unit: item.price_per_unit,
        size: item.size,
      }));
  }, [inventory]);

  // Prepare recipes for dish ingredients
  const availableRecipes: RecipeOption[] = useMemo(() => {
    return recipes.map((recipe) => ({
      id: recipe.id!,
      name: recipe.name,
      units: recipe.units || 0,
      cost_per_unit: calculateRecipeCostPerUnit(recipe),
      ingredients: recipe.ingredients,
    }));
  }, [recipes]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      // Force height update when search changes
      setTimeout(forceUpdateHeight, 100);
    },
    [forceUpdateHeight]
  );

  const handleCreate = useCallback(
    async (data: DishFormData & { ingredients?: any[] }) => {
      return await create(data);
    },
    [create]
  );

  const handleEdit = useCallback((dishId: string) => {
    setEditingDishId(dishId);
  }, []);

  const handleUpdate = useCallback(
    async (
      id: string,
      data: Partial<DishFormData> & { ingredients?: any[] }
    ) => {
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
    setEditingDishId("");
  }, []);

  const handleOpenCreatePanel = useCallback(() => {
    setShowCreatePanel(true);
  }, []);

  const handleIngredientClick = useCallback(
    (inventoryId?: string, recipeId?: string) => {
      if (inventoryId) {
        const item = inventory?.find((i) => i.id === inventoryId);
        if (item) {
          // Transform the item to have the correct date format for the form
          const editingItem = {
            ...item,
            count_date: formatDateForInput(item.count_date),
          };
          setEditingInventoryItem(editingItem);
        }
      } else if (recipeId) {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (recipe) {
          setEditingRecipe(recipe);
        }
      }
    },
    [inventory, recipes]
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

  const handleUpdateRecipe = useCallback(
    async (id: string, data: Partial<RecipeFormData>) => {
      return await updateRecipe(id, data);
    },
    [updateRecipe]
  );

  const handleDeleteRecipe = useCallback(
    async (id: string) => {
      await removeRecipe(id);
    },
    [removeRecipe]
  );

  const handleCloseRecipePanel = useCallback(() => {
    setEditingRecipe(null);
  }, []);

  if (loading) {
    return (
      <Box display="flexCol" align="start" justify="start" padding="lg" gap={4}>
        <Text>Loading dishes...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flexCol" align="start" justify="start" padding="lg" gap={4}>
        <Text className="text-error">Error loading dishes: {error}</Text>
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
          placeholder: "Search dishes...",
          value: searchTerm,
          onChange: handleSearchChange,
        }}
        primaryAction={{
          onPress: handleOpenCreatePanel,
          icon: "Plus",
          label: "Add dish",
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
        <DishesList
          dishes={dishes}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          onEdit={handleEdit}
          onIngredientClick={handleIngredientClick}
        />
      </Box>

      {/* Side Panels */}
      <CreateDishSection
        isOpen={showCreatePanel}
        onClose={handleCloseCreatePanel}
        availableInventory={availableInventory}
        availableRecipes={availableRecipes}
      />

      <EditDishSection
        isOpen={!!editingDishId}
        dishId={editingDishId}
        onClose={handleCloseEditPanel}
        availableInventory={availableInventory}
        availableRecipes={availableRecipes}
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

      <EditRecipeSection
        editingRecipe={editingRecipe}
        onUpdate={handleUpdateRecipe}
        onDelete={handleDeleteRecipe}
        isUpdating={isUpdatingRecipe}
        isDeleting={isDeletingRecipe}
        availableInventory={availableInventory}
        onClose={handleCloseRecipePanel}
      />
    </Box>
  );
}

DishClient.displayName = "DishClient";
