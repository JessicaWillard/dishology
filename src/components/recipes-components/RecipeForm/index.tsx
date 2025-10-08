import { useRecipeForm } from "@/hooks/useRecipeForm";
import { useInventory } from "@/hooks/useInventoryQuery";
import { InventoryType } from "../../inventory-components/interface";
import type { RecipeFormProps, RecipeIngredientRowProps } from "../interface";
import { Box } from "../../ui/Box";
import { Button } from "../../ui/Button";
import { Text } from "../../ui/Text";
import { Input } from "../../fields/Input";
import { TextArea } from "../../fields/TextArea";
import { ComboBox } from "../../fields/ComboBox";
import {
  recipeFormStyles,
  recipeFormSectionStyles,
  recipeFormRowStyles,
  recipeIngredientsFormStyles,
  recipeIngredientRowStyles,
} from "../theme";
import { clsx } from "clsx";
import Icon from "@/components/ui/Icon";

const RecipeIngredientRow = (props: RecipeIngredientRowProps) => {
  const {
    ingredient,
    index,
    availableInventory,
    onUpdate,
    onRemove,
    errors = {},
  } = props;

  const inventoryOptions = availableInventory.map((item) => ({
    id: item.id,
    name: `${item.name} (${item.type}) - ${item.unit || "no unit"}`,
  }));

  return (
    <Box className={clsx(recipeIngredientRowStyles())}>
      <ComboBox
        id={`ingredient-${index}-inventory`}
        label="Ingredient"
        selectedKey={ingredient.inventory_id}
        onSelectionChange={(key) => {
          const selectedInventory = availableInventory.find(
            (inv) => inv.id === key
          );
          onUpdate(index, "inventory_id", key as string);
          if (selectedInventory?.unit) {
            onUpdate(index, "unit", selectedInventory.unit);
          }
        }}
        items={inventoryOptions}
        placeholder="Select ingredient..."
        error={!!errors.inventory_id}
        errorMessage={errors.inventory_id}
        required
        className="w-full"
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
        className="w-[100px]"
      />

      <Text size="sm" weight="medium" className="text-gray-dark">
        {ingredient.unit || (ingredient.inventory_id ? "—" : "—")}
      </Text>

      <Box display="flexCol" justify="end">
        <Button
          variant="destructive"
          iconOnly
          handlePress={() => onRemove(index)}
        >
          <Icon name="CloseBtn" />
        </Button>
      </Box>
    </Box>
  );
};

export const RecipeForm = (props: RecipeFormProps) => {
  const {
    initialData,
    onSubmit,
    onCancel,
    onDelete,
    isSubmitting = false,
    submitLabel = "Save Recipe",
    availableInventory = [],
    mode = "create",
    showCancel = false,
  } = props;

  // Get inventory for ingredient selection
  const { inventory } = useInventory();

  // Filter inventory to only include allowed types
  const ALLOWED_INVENTORY_TYPES = [
    "produce",
    "dry",
    "meat",
    "dairy",
    "beverage",
    "other",
  ];

  const filteredInventory =
    availableInventory.length > 0
      ? availableInventory
      : (inventory || [])
          .filter((item) =>
            ALLOWED_INVENTORY_TYPES.includes(item.type || "other")
          )
          .map((item) => ({
            id: item.id!,
            name: item.name,
            type: item.type || "other",
            unit: item.unit,
            price_per_unit: item.price_per_unit,
          }));

  const {
    formData,
    ingredients,
    errors,
    isSubmitting: formSubmitting,
    updateField,
    updateIngredient,
    addIngredient,
    removeIngredient,
    validateFieldOnBlur,
    handleSubmit,
    resetForm,
    getFieldProps,
  } = useRecipeForm({
    initialData: initialData
      ? {
          name: initialData.name,
          description: initialData.description || undefined,
          batch_size: initialData.batch_size || undefined,
          batch_unit: initialData.batch_unit || undefined,
          units: initialData.units || undefined,
          prep_time: initialData.prep_time || undefined,
          instructions: initialData.instructions || undefined,
        }
      : undefined,
    initialIngredients:
      initialData?.ingredients?.map((ing) => ({
        inventory_id: ing.inventory_id,
        quantity: ing.quantity,
        unit: ing.unit || "",
      })) || [],
    formId:
      mode === "edit" && initialData?.id ? `edit-${initialData.id}` : "create",
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleSubmit(async (data) => {
      // Transform the data to match RecipeWithIngredients
      const transformedData = {
        ...data,
        id: initialData?.id || "",
        user_id: initialData?.user_id || "",
        created_at: initialData?.created_at || new Date().toISOString(),
        ingredients:
          data.ingredients?.map((ing) => {
            const inventoryItem = filteredInventory.find(
              (inv) => inv.id === ing.inventory_id
            )!;
            return {
              id: "",
              recipe_id: initialData?.id || "",
              inventory_id: ing.inventory_id,
              quantity: ing.quantity,
              unit: ing.unit,
              created_at: new Date().toISOString(),
              inventory: {
                id: inventoryItem.id,
                name: inventoryItem.name,
                type: inventoryItem.type as InventoryType,
                unit: inventoryItem.unit || null,
                price_per_unit: inventoryItem.price_per_unit,
                user_id: "",
                quantity: "0",
                count_date: new Date().toISOString(),
                description: null,
                size: null,
                price_per_pack: null,
                supplier_id: null,
                location: null,
                min_count: null,
                created_at: new Date().toISOString(),
              },
            };
          }) || [],
      };

      await onSubmit(transformedData);
      return transformedData;
    });
  };

  const submitting = isSubmitting || formSubmitting;

  const UNITS = [
    { id: "kg", name: "kg" },
    { id: "g", name: "g" },
    { id: "l", name: "l" },
    { id: "ml", name: "ml" },
  ];

  return (
    <form onSubmit={handleFormSubmit} className={clsx(recipeFormStyles())}>
      {/* Basic Recipe Information */}
      <Box className={clsx(recipeFormSectionStyles())}>
        <Text size="lg" weight="bold">
          Recipe Details
        </Text>

        <Box className={clsx(recipeFormRowStyles({ columns: 1 }))}>
          <Input
            id="recipe-name"
            label="Recipe Name"
            value={formData.name}
            onChange={(value, e) => updateField("name", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("name", e.target.value)}
            placeholder="Enter recipe name..."
            {...getFieldProps("name")}
          />
        </Box>

        <Box className={clsx(recipeFormRowStyles({ columns: 1 }))}>
          <TextArea
            id="recipe-description"
            label="Description"
            value={formData.description || ""}
            onChange={(value, e) => updateField("description", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("description", e.target.value)}
            placeholder="Describe this recipe..."
            rows={3}
            {...getFieldProps("description")}
          />
        </Box>

        <Box className={clsx(recipeFormRowStyles({ columns: 3 }))}>
          <Input
            id="recipe-batch-size"
            label="Batch Size"
            type="number"
            step="0.01"
            min="0"
            value={formData.batch_size?.toString() || ""}
            onChange={(value, e) =>
              updateField("batch_size", parseFloat(e.target.value) || null)
            }
            onBlur={(e) =>
              validateFieldOnBlur(
                "batch_size",
                parseFloat(e.target.value) || null
              )
            }
            placeholder="1.5"
            {...getFieldProps("batch_size")}
          />

          <ComboBox
            id="recipe-batch-unit"
            label="Batch Unit"
            items={UNITS}
            selectedKey={formData.batch_unit || null}
            onSelectionChange={(key) =>
              updateField("batch_unit", (key as string) || "")
            }
            placeholder="Select unit..."
            {...getFieldProps("batch_unit")}
          />

          <Input
            id="recipe-prep-time"
            label="Prep Time"
            value={formData.prep_time || ""}
            onChange={(value, e) => updateField("prep_time", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("prep_time", e.target.value)}
            placeholder="30m, 1h 15m..."
            {...getFieldProps("prep_time")}
          />
        </Box>

        <Box className={clsx(recipeFormRowStyles({ columns: 1 }))}>
          <Input
            id="recipe-units"
            label="Units (Individual Servings)"
            type="number"
            step="1"
            min="1"
            value={formData.units?.toString() || ""}
            onChange={(value, e) => {
              const numValue = parseInt(e.target.value);
              updateField("units", isNaN(numValue) ? null : numValue);
            }}
            onBlur={(e) => {
              const numValue = parseInt(e.target.value);
              validateFieldOnBlur("units", isNaN(numValue) ? null : numValue);
            }}
            placeholder="20"
            {...getFieldProps("units")}
          />
          <Text size="xs" className="text-gray-500 mt-1">
            How many individual servings does this batch make? (e.g., 1 lb of
            honey butter = 20 servings)
          </Text>
        </Box>
      </Box>

      {/* Ingredients */}
      <Box className={clsx(recipeFormSectionStyles())}>
        <Box display="flexRow" justify="between" align="center">
          <Text size="lg" weight="bold">
            Ingredients
          </Text>
          <Button
            type="button"
            variant="solid"
            iconOnly
            handlePress={addIngredient}
            disabled={submitting}
          >
            <Icon name="Plus" />
          </Button>
        </Box>

        {ingredients.length === 0 ? (
          <Text size="sm" className="text-gray-500 italic">
            No ingredients added yet. Click &quot;Add Ingredient&quot; to get
            started.
          </Text>
        ) : (
          <Box className={clsx(recipeIngredientsFormStyles())}>
            {ingredients.map((ingredient, index) => (
              <RecipeIngredientRow
                key={index}
                ingredient={ingredient}
                index={index}
                availableInventory={filteredInventory}
                onUpdate={updateIngredient}
                onRemove={removeIngredient}
                errors={{
                  inventory_id: errors[`ingredient_${index}_inventory_id`],
                  quantity: errors[`ingredient_${index}_quantity`],
                  unit: errors[`ingredient_${index}_unit`],
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Instructions */}
      <Box className={clsx(recipeFormSectionStyles())}>
        <Text size="lg" weight="bold">
          Instructions
        </Text>

        <TextArea
          id="recipe-instructions"
          label="Cooking Instructions"
          value={formData.instructions || ""}
          onChange={(value, e) => updateField("instructions", e.target.value)}
          onBlur={(e) => validateFieldOnBlur("instructions", e.target.value)}
          rows={8}
          {...getFieldProps("instructions")}
        />
        <Text size="xs" className="text-gray-500">
          Write each step on a new line. They will be automatically numbered.
        </Text>
      </Box>

      {/* Form Actions */}
      <Box display="flexRow" justify="between" gap={3}>
        {mode === "edit" && onDelete && (
          <Button
            type="button"
            variant="destructive"
            handlePress={onDelete}
            disabled={submitting}
          >
            Delete recipe
          </Button>
        )}

        {showCancel && mode === "create" && onCancel && (
          <Button
            type="button"
            variant="ghost"
            handlePress={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}

        {mode === "create" && (
          <Button
            type="button"
            variant="ghost"
            handlePress={resetForm}
            disabled={submitting}
          >
            Reset
          </Button>
        )}

        <Button
          type="submit"
          variant="solid"
          disabled={submitting || !formData.name.trim()}
          isLoading={submitting}
        >
          {submitLabel}
        </Button>
      </Box>
    </form>
  );
};

RecipeForm.displayName = "RecipeForm";
