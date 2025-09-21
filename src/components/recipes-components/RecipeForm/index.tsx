import { useRecipeForm } from "@/hooks/useRecipeForm";
import { useInventoryQuery } from "@/hooks/useInventoryQuery";
import type { RecipeFormProps, RecipeIngredientRowProps } from "./interface";
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
    name: `${item.name} (${item.type})`,
  }));

  return (
    <Box className={clsx(recipeIngredientRowStyles())}>
      <ComboBox
        id={`ingredient-${index}-inventory`}
        label="Ingredient"
        value={ingredient.inventory_id}
        onChange={(value) => onUpdate(index, "inventory_id", value)}
        options={inventoryOptions}
        placeholder="Select ingredient..."
        error={!!errors.inventory_id}
        errorMessage={errors.inventory_id}
        required
      />

      <Input
        id={`ingredient-${index}-quantity`}
        label="Quantity"
        type="number"
        step="0.01"
        min="0"
        value={ingredient.quantity.toString()}
        onChange={(e) =>
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
        onChange={(e) => onUpdate(index, "unit", e.target.value)}
        placeholder="kg, lbs, cups..."
        error={!!errors.unit}
        errorMessage={errors.unit}
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

export const RecipeForm = (props: RecipeFormProps) => {
  const {
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
    submitLabel = "Save Recipe",
    availableInventory = [],
  } = props;

  // Get inventory for ingredient selection
  const { inventory } = useInventoryQuery();

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
    getFieldProps,
    getIngredientFieldProps,
  } = useRecipeForm({
    initialData,
    initialIngredients:
      initialData?.ingredients?.map((ing) => ({
        inventory_id: ing.inventory_id,
        quantity: ing.quantity,
        unit: ing.unit || "",
      })) || [],
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await handleSubmit(async (data) => {
      // Transform the data to match RecipeWithIngredients
      const transformedData = {
        ...data,
        id: initialData?.id || "",
        user_id: initialData?.user_id || "",
        created_at: initialData?.created_at || new Date().toISOString(),
        ingredients:
          data.ingredients?.map((ing) => ({
            id: "",
            recipe_id: initialData?.id || "",
            inventory_id: ing.inventory_id,
            quantity: ing.quantity,
            unit: ing.unit,
            created_at: new Date().toISOString(),
            inventory: filteredInventory.find(
              (inv) => inv.id === ing.inventory_id
            )!,
          })) || [],
      };

      await onSubmit(transformedData);
      return transformedData;
    });
  };

  const submitting = isSubmitting || formSubmitting;

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
            onChange={(e) => updateField("name", e.target.value)}
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
            onChange={(e) => updateField("description", e.target.value)}
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
            onChange={(e) =>
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

          <Input
            id="recipe-batch-unit"
            label="Batch Unit"
            value={formData.batch_unit || ""}
            onChange={(e) => updateField("batch_unit", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("batch_unit", e.target.value)}
            placeholder="kg, L, portions..."
            {...getFieldProps("batch_unit")}
          />

          <Input
            id="recipe-prep-time"
            label="Prep Time"
            value={formData.prep_time || ""}
            onChange={(e) => updateField("prep_time", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("prep_time", e.target.value)}
            placeholder="30m, 1h 15m..."
            {...getFieldProps("prep_time")}
          />
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
            variant="ghost"
            handlePress={addIngredient}
            leftIcon="Plus"
            disabled={submitting}
          >
            Add Ingredient
          </Button>
        </Box>

        {ingredients.length === 0 ? (
          <Text size="sm" className="text-gray-500 italic">
            No ingredients added yet. Click "Add Ingredient" to get started.
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
          onChange={(e) => updateField("instructions", e.target.value)}
          onBlur={(e) => validateFieldOnBlur("instructions", e.target.value)}
          placeholder="1. Preheat oven to 375°F&#10;2. Mix together flour, sugar, and baking powder&#10;3. Gradually add in the milk and melted butter..."
          rows={8}
          {...getFieldProps("instructions")}
        />
        <Text size="xs" className="text-gray-500">
          Write each step on a new line. They will be automatically numbered.
        </Text>
      </Box>

      {/* Form Actions */}
      <Box display="flexRow" gap="md" justify="end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            handlePress={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="solid"
          disabled={submitting || !formData.name.trim()}
          loading={submitting}
        >
          {submitLabel}
        </Button>
      </Box>
    </form>
  );
};

RecipeForm.displayName = "RecipeForm";
