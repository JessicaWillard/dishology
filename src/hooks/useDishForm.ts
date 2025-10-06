import { useState, useCallback, useEffect, useMemo } from "react";
import type {
  DishFormData,
  DishWithIngredients,
  DishIngredientFormData,
  RecipeWithIngredients,
  Inventory,
} from "@/utils/types/database";
import {
  validateDishWithIngredients,
  validateField,
  type ValidationErrors,
} from "@/utils/validation/dish";
import type { CreateDishData } from "@/utils/api/dishes";
import {
  calculateDishCost,
  calculateProfit,
  calculateMargin,
  type DishIngredientWithDetails,
} from "@/utils/dishCalculations";

interface UseDishFormOptions {
  initialData?: Partial<DishFormData>;
  initialIngredients?: DishIngredientFormData[];
  onSuccess?: (dish: DishWithIngredients) => void;
  onError?: (error: Error) => void;
  formId?: string;
  enablePersistence?: boolean;
  // Inventory and recipes for real-time cost calculations
  availableInventory?: Inventory[];
  availableRecipes?: RecipeWithIngredients[];
}

const STORAGE_PREFIX = "dish_form_";

const getStorageKey = (formId: string) => `${STORAGE_PREFIX}${formId}`;

const saveFormData = (
  formId: string,
  data: DishFormData,
  ingredients: DishIngredientFormData[]
) => {
  try {
    localStorage.setItem(
      getStorageKey(formId),
      JSON.stringify({ dish: data, ingredients })
    );
  } catch (error) {
    console.warn("Failed to save form data to localStorage:", error);
  }
};

const loadFormData = (
  formId: string
): {
  dish: DishFormData;
  ingredients: DishIngredientFormData[];
} | null => {
  try {
    const saved = localStorage.getItem(getStorageKey(formId));
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn("Failed to load form data from localStorage:", error);
    return null;
  }
};

const clearFormData = (formId: string) => {
  try {
    localStorage.removeItem(getStorageKey(formId));
  } catch (error) {
    console.warn("Failed to clear form data from localStorage:", error);
  }
};

export function useDishForm(options: UseDishFormOptions = {}) {
  const {
    initialData,
    initialIngredients = [],
    onSuccess,
    onError,
    formId = "default",
    enablePersistence = true,
    availableInventory = [],
    availableRecipes = [],
  } = options;

  const getInitialFormData = (): {
    dish: DishFormData;
    ingredients: DishIngredientFormData[];
  } => {
    if (enablePersistence) {
      const savedData = loadFormData(formId);
      if (savedData) {
        return savedData;
      }
    }

    return {
      dish: {
        name: initialData?.name || "",
        description: initialData?.description || "",
        instructions: initialData?.instructions || "",
        prep_time: initialData?.prep_time || "",
        sell_price: initialData?.sell_price || undefined,
      },
      ingredients: initialIngredients,
    };
  };

  const initialFormData = getInitialFormData();
  const [formData, setFormData] = useState<DishFormData>(initialFormData.dish);
  const [ingredients, setIngredients] = useState<DishIngredientFormData[]>(
    initialFormData.ingredients
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Calculate real-time costs
  const dishMetrics = useMemo(() => {
    // Build ingredient details for cost calculation
    const ingredientDetails: DishIngredientWithDetails[] = ingredients
      .map((ing, index) => {
        if (ing.inventory_id) {
          const inventory = availableInventory.find(
            (inv) => inv.id === ing.inventory_id
          );
          if (!inventory) return null;

          return {
            id: `temp-${index}`,
            quantity: ing.quantity,
            unit: ing.unit,
            inventory_id: ing.inventory_id,
            recipe_id: null,
            inventory: {
              id: inventory.id,
              name: inventory.name,
              price_per_unit: inventory.price_per_unit,
              size: inventory.size,
              type: inventory.type,
              unit: inventory.unit,
            },
            recipe: null,
          };
        } else if (ing.recipe_id) {
          const recipe = availableRecipes.find(
            (rec) => rec.id === ing.recipe_id
          );
          if (!recipe) return null;

          return {
            id: `temp-${index}`,
            quantity: ing.quantity,
            unit: ing.unit,
            inventory_id: null,
            recipe_id: ing.recipe_id,
            inventory: null,
            recipe,
          };
        }
        return null;
      })
      .filter(Boolean) as DishIngredientWithDetails[];

    const cost = calculateDishCost(ingredientDetails);
    const sellPrice = formData.sell_price || 0;
    const profit = calculateProfit(sellPrice, cost);
    const margin = calculateMargin(profit, sellPrice);

    return {
      cost,
      profit,
      margin,
    };
  }, [ingredients, formData.sell_price, availableInventory, availableRecipes]);

  useEffect(() => {
    if (enablePersistence && isDirty) {
      saveFormData(formId, formData, ingredients);
    }
  }, [formData, ingredients, formId, enablePersistence, isDirty]);

  const updateField = useCallback(
    (fieldName: string, value: string | number | null) => {
      setIsDirty(true);

      setFormData((prev) => {
        const newData = {
          ...prev,
          [fieldName]: value,
        };
        return newData;
      });

      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }
    },
    [errors]
  );

  const updateIngredient = useCallback(
    (
      index: number,
      field: keyof DishIngredientFormData,
      value: string | number
    ) => {
      setIsDirty(true);

      setIngredients((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });

      // Clear ingredient-specific errors
      const errorKey = `ingredient_${index}_${field}`;
      if (errors[errorKey]) {
        setErrors((prev) => ({
          ...prev,
          [errorKey]: undefined,
        }));
      }
    },
    [errors]
  );

  const addIngredient = useCallback(() => {
    setIsDirty(true);
    setIngredients((prev) => [
      ...prev,
      {
        inventory_id: undefined,
        recipe_id: undefined,
        quantity: 0,
        unit: "",
      },
    ]);
  }, []);

  const removeIngredient = useCallback((index: number) => {
    setIsDirty(true);
    setIngredients((prev) => prev.filter((_, i) => i !== index));

    // Clear errors for removed ingredient
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`ingredient_${index}_`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  }, []);

  const validateFieldOnBlur = useCallback(
    (fieldName: string, value: string | number | null) => {
      const error = validateField(fieldName, value);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error,
        }));
      }
    },
    []
  );

  const resetForm = useCallback(() => {
    const resetData = {
      name: initialData?.name || "",
      description: initialData?.description || "",
      instructions: initialData?.instructions || "",
      prep_time: initialData?.prep_time || "",
      sell_price: initialData?.sell_price || undefined,
    };

    setFormData(resetData);
    setIngredients(initialIngredients);
    setErrors({});
    setIsDirty(false);

    if (enablePersistence) {
      clearFormData(formId);
    }
  }, [initialData, initialIngredients, enablePersistence, formId]);

  const handleSubmit = useCallback(
    async (
      onSubmit: (data: CreateDishData) => Promise<DishWithIngredients>
    ) => {
      const validationErrors = validateDishWithIngredients(
        formData,
        ingredients
      );
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return false;
      }

      setIsSubmitting(true);
      try {
        const submitData: CreateDishData = {
          ...formData,
          ingredients: ingredients.filter(
            (ing) =>
              (ing.inventory_id || ing.recipe_id) &&
              ing.quantity > 0 &&
              !(ing.inventory_id && ing.recipe_id) // Ensure only one is set
          ),
        };

        const result = await onSubmit(submitData);
        onSuccess?.(result);
        setIsDirty(false);

        if (enablePersistence) {
          clearFormData(formId);
        }

        return true;
      } catch (error) {
        const err =
          error instanceof Error
            ? error
            : new Error("An unknown error occurred");
        onError?.(err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, ingredients, onSuccess, onError, enablePersistence, formId]
  );

  return {
    formData,
    ingredients,
    errors,
    isSubmitting,
    isDirty,
    // Dish-specific metrics
    dishMetrics,
    updateField,
    updateIngredient,
    addIngredient,
    removeIngredient,
    validateFieldOnBlur,
    resetForm,
    handleSubmit,
    getFieldProps: (fieldName: string) => ({
      error: !!errors[fieldName],
      errorMessage: errors[fieldName],
      required: fieldName === "name" || fieldName === "sell_price",
    }),
    getIngredientFieldProps: (
      index: number,
      field: keyof DishIngredientFormData
    ) => ({
      error: !!errors[`ingredient_${index}_${field}`],
      errorMessage: errors[`ingredient_${index}_${field}`],
      required: field === "quantity",
    }),
    clearPersistence: () => clearFormData(formId),
  };
}
