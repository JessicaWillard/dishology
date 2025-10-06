"use client";

import { useDishForm } from "@/hooks/useDishForm";
import type {
  DishFormProps,
  DishIngredientRowProps,
  IngredientOption,
} from "../interface";
import { Box } from "../../ui/Box";
import { Button } from "../../ui/Button";
import { Text } from "../../ui/Text";
import { Input } from "../../fields/Input";
import { TextArea } from "../../fields/TextArea";
import { ComboBox } from "../../fields/ComboBox";
import {
  costAnalysisStyles,
  costAnalysisRowStyles,
  // profitStyles,
  // marginBadgeStyles,
  ingredientRowStyles,
} from "../theme";
import { clsx } from "clsx";
import { calculateRecipeCostPerUnit } from "@/utils/dishCalculations";

const DishIngredientRow = (props: DishIngredientRowProps) => {
  const {
    ingredient,
    index,
    availableOptions,
    onUpdate,
    onRemove,
    errors = {},
  } = props;

  // Build display options for ComboBox
  const displayOptions = availableOptions.map((item) => ({
    id: item.id,
    name: item.name,
  }));

  // Determine current selection (either inventory or recipe)
  const selectedId = ingredient.inventory_id || ingredient.recipe_id || "";

  // Find selected option for type detection
  const selectedOption = availableOptions.find((opt) => opt.id === selectedId);
  const ingredientType = selectedOption?.type || "default";

  return (
    <Box className={clsx(ingredientRowStyles({ type: ingredientType as any }))}>
      <ComboBox
        id={`ingredient-${index}-item`}
        label="Ingredient or Recipe"
        selectedKey={selectedId}
        onSelectionChange={(key) => {
          const selected = availableOptions.find((opt) => opt.id === key);
          if (selected) {
            if (selected.source === "inventory") {
              onUpdate(index, "inventory_id", key as string);
              onUpdate(index, "recipe_id", ""); // Clear recipe_id
              if (selected.unit) {
                onUpdate(index, "unit", selected.unit);
              }
            } else {
              onUpdate(index, "recipe_id", key as string);
              onUpdate(index, "inventory_id", ""); // Clear inventory_id
              onUpdate(index, "unit", "units");
            }
          }
        }}
        items={displayOptions}
        placeholder="Select ingredient or recipe..."
        error={!!errors.inventory_id || !!errors.recipe_id}
        errorMessage={errors.inventory_id || errors.recipe_id}
        required
      />

      <Input
        id={`ingredient-${index}-quantity`}
        label="Quantity"
        type="number"
        step="0.01"
        min="0"
        value={ingredient.quantity?.toString() || ""}
        onChange={(value, e) =>
          onUpdate(index, "quantity", parseFloat(e.target.value) || 0)
        }
        error={!!errors.quantity}
        errorMessage={errors.quantity}
        required
      />

      <Input
        id={`ingredient-${index}-unit`}
        label="Unit"
        value={ingredient.unit || ""}
        onChange={(value, e) => onUpdate(index, "unit", e.target.value)}
        placeholder={selectedId ? "Auto-filled" : "Select item first"}
        error={!!errors.unit}
        errorMessage={errors.unit}
        disabled
        className="bg-gray-50"
      />

      <Box display="flexCol" justify="end">
        <Button
          variant="ghost"
          handlePress={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 w-full"
        >
          Remove
        </Button>
      </Box>
    </Box>
  );
};

export const DishForm = (props: DishFormProps) => {
  const {
    initialData,
    onSubmit,
    onCancel,
    onDelete,
    isSubmitting = false,
    submitLabel = "Save Dish",
    availableInventory = [],
    availableRecipes = [],
    mode = "create",
    showCancel = false,
  } = props;

  // Build unified ingredient options (inventory + recipes)
  const ALLOWED_INVENTORY_TYPES = [
    "produce",
    "dry",
    "meat",
    "dairy",
    "beverage",
    "other",
  ];

  const ingredientOptions: IngredientOption[] = [
    // Inventory items
    ...availableInventory
      .filter((item) => ALLOWED_INVENTORY_TYPES.includes(item.type || "other"))
      .map((item) => ({
        id: item.id,
        name: `${item.name} (${item.type})`,
        type: item.type || "other",
        unit: item.unit || undefined,
        source: "inventory" as const,
        price_per_unit: item.price_per_unit,
      })),
    // Recipe items
    ...availableRecipes.map((recipe) => ({
      id: recipe.id,
      name: `${recipe.name} (recipe)`,
      type: "recipe",
      unit: "units",
      source: "recipe" as const,
      cost_per_unit: calculateRecipeCostPerUnit(recipe),
    })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  const {
    formData,
    ingredients,
    errors,
    isSubmitting: formSubmitting,
    dishMetrics,
    updateField,
    updateIngredient,
    addIngredient,
    removeIngredient,
    validateFieldOnBlur,
    handleSubmit,
    getFieldProps,
  } = useDishForm({
    initialData: initialData
      ? {
          name: initialData.name,
          description: initialData.description || undefined,
          instructions: initialData.instructions || undefined,
          prep_time: initialData.prep_time || undefined,
          sell_price: initialData.sell_price || undefined,
        }
      : undefined,
    initialIngredients:
      initialData?.ingredients?.map((ing) => ({
        inventory_id: ing.inventory_id || undefined,
        recipe_id: ing.recipe_id || undefined,
        quantity: ing.quantity,
        unit: ing.unit || "",
      })) || [],
    formId:
      mode === "edit" && initialData?.id ? `edit-${initialData.id}` : "create",
    enablePersistence: mode === "create", // Only persist drafts for new dishes
    availableInventory,
    availableRecipes,
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleSubmit(async (data) => {
      // Transform the data to match DishWithIngredients
      const transformedData = {
        ...data,
        id: initialData?.id || "",
        user_id: initialData?.user_id || "",
        created_at: initialData?.created_at || new Date().toISOString(),
        ingredients: data.ingredients || [],
      };

      await onSubmit(transformedData as any);
      return transformedData as any;
    });
  };

  const profitVariant =
    dishMetrics.profit > 0
      ? "positive"
      : dishMetrics.profit < 0
      ? "negative"
      : "neutral";

  return (
    <form onSubmit={handleFormSubmit}>
      <Box display="flexCol" gap="lg">
        {/* Dish Details Section */}
        <Box display="flexCol" gap="md">
          <Text size="md" weight="bold">
            Dish Details
          </Text>

          <Input
            id="dish-name"
            label="Dish Name"
            value={formData.name}
            onChange={(value) => updateField("name", value)}
            onBlur={() => validateFieldOnBlur("name", formData.name)}
            {...getFieldProps("name")}
            placeholder="e.g., Margherita Pizza"
          />

          <TextArea
            id="dish-description"
            label="Description"
            value={formData.description || ""}
            onChange={(value) => updateField("description", value)}
            onBlur={() =>
              validateFieldOnBlur("description", formData.description || "")
            }
            {...getFieldProps("description")}
            placeholder="Brief description of the dish..."
            rows={3}
          />

          <Box display="flexRow" gap="md">
            <Input
              id="dish-prep-time"
              label="Prep Time"
              value={formData.prep_time || ""}
              onChange={(value) => updateField("prep_time", value)}
              {...getFieldProps("prep_time")}
              placeholder="e.g., 15m, 1h 30m"
            />

            <Input
              id="dish-sell-price"
              label="Sell Price"
              type="number"
              step="0.01"
              min="0"
              value={formData.sell_price?.toString() || ""}
              onChange={(value, e) =>
                updateField("sell_price", parseFloat(e.target.value) || 0)
              }
              onBlur={() =>
                validateFieldOnBlur("sell_price", formData.sell_price || 0)
              }
              {...getFieldProps("sell_price")}
              placeholder="0.00"
            />
          </Box>

          <TextArea
            id="dish-instructions"
            label="Instructions"
            value={formData.instructions || ""}
            onChange={(value) => updateField("instructions", value)}
            {...getFieldProps("instructions")}
            placeholder="Preparation instructions..."
            rows={6}
          />
        </Box>

        {/* Ingredients Section */}
        <Box display="flexCol" gap="md">
          <Box display="flexRow" justify="between" align="center">
            <Text size="md" weight="bold">
              Ingredients
            </Text>
            <Button type="button" variant="outline" handlePress={addIngredient}>
              + Add Ingredient
            </Button>
          </Box>

          {ingredients.length === 0 ? (
            <Text size="sm" className="text-gray-500 italic">
              No ingredients added yet. Click &quot;Add Ingredient&quot; to
              start.
            </Text>
          ) : (
            <Box display="flexCol" gap="sm">
              {ingredients.map((ingredient, index) => (
                <DishIngredientRow
                  key={index}
                  ingredient={ingredient}
                  index={index}
                  availableOptions={ingredientOptions}
                  onUpdate={updateIngredient}
                  onRemove={removeIngredient}
                  errors={{
                    inventory_id: errors[`ingredient_${index}_inventory_id`],
                    recipe_id: errors[`ingredient_${index}_recipe_id`],
                    quantity: errors[`ingredient_${index}_quantity`],
                    unit: errors[`ingredient_${index}_unit`],
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Cost Analysis Section */}
        <Box className={clsx(costAnalysisStyles())}>
          <Text size="md" weight="bold" className="mb-4">
            Cost Analysis
          </Text>

          <Box display="flexCol" gap="xs">
            <Box className={clsx(costAnalysisRowStyles())}>
              <Text size="sm">Total Cost</Text>
              <Text size="sm" weight="medium">
                ${dishMetrics.cost.toFixed(2)}
              </Text>
            </Box>

            <Box className={clsx(costAnalysisRowStyles())}>
              <Text size="sm">Sell Price</Text>
              <Text size="sm" weight="medium">
                ${(formData.sell_price || 0).toFixed(2)}
              </Text>
            </Box>

            <hr className="border-gray-light" />

            <Box
              className={clsx(costAnalysisRowStyles({ variant: "highlight" }))}
            >
              <Text size="md" weight="bold">
                Profit
              </Text>
              <Text
                size="md"
                weight="bold"
                // className={clsx(profitStyles({ variant: profitVariant }))}
              >
                ${dishMetrics.profit.toFixed(2)}
              </Text>
            </Box>

            <Box
              className={clsx(costAnalysisRowStyles({ variant: "highlight" }))}
            >
              <Text size="md" weight="bold">
                Profit Margin
              </Text>
              <span
              // className={clsx(marginBadgeStyles({ variant: profitVariant }))}
              >
                {dishMetrics.margin.toFixed(2)}%
              </span>
            </Box>
          </Box>
        </Box>

        {/* Form Actions */}
        <Box display="flexRow" gap="md" justify="between">
          <Box display="flexRow" gap="md">
            <Button
              type="submit"
              variant="solid"
              isDisabled={isSubmitting || formSubmitting}
            >
              {isSubmitting || formSubmitting ? "Saving..." : submitLabel}
            </Button>

            {showCancel && onCancel && (
              <Button
                type="button"
                variant="outline"
                handlePress={onCancel}
                isDisabled={isSubmitting || formSubmitting}
              >
                Cancel
              </Button>
            )}
          </Box>

          {mode === "edit" && onDelete && (
            <Button
              type="button"
              variant="ghost"
              handlePress={onDelete}
              isDisabled={isSubmitting || formSubmitting}
              className="text-red-600 hover:text-red-700"
            >
              Delete Dish
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
};

DishForm.displayName = "DishForm";
