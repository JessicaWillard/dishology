import { useState, useCallback, useEffect } from "react";
import type {
  RecipeFormData,
  RecipeWithIngredients,
  RecipeIngredientFormData,
} from "@/utils/types/database";
import {
  validateRecipeWithIngredients,
  validateField,
  type ValidationErrors,
} from "@/utils/validation/recipe";
import type { CreateRecipeData } from "@/utils/api/recipes";

interface UseRecipeFormOptions {
  initialData?: Partial<RecipeFormData>;
  initialIngredients?: RecipeIngredientFormData[];
  onSuccess?: (recipe: RecipeWithIngredients) => void;
  onError?: (error: Error) => void;
  formId?: string;
  enablePersistence?: boolean;
}

const STORAGE_PREFIX = "recipe_form_";

const getStorageKey = (formId: string) => `${STORAGE_PREFIX}${formId}`;

const saveFormData = (
  formId: string,
  data: RecipeFormData,
  ingredients: RecipeIngredientFormData[]
) => {
  try {
    localStorage.setItem(
      getStorageKey(formId),
      JSON.stringify({ recipe: data, ingredients })
    );
  } catch (error) {
    console.warn("Failed to save form data to localStorage:", error);
  }
};

const loadFormData = (
  formId: string
): {
  recipe: RecipeFormData;
  ingredients: RecipeIngredientFormData[];
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

export function useRecipeForm(options: UseRecipeFormOptions = {}) {
  const {
    initialData,
    initialIngredients = [],
    onSuccess,
    onError,
    formId = "default",
    enablePersistence = true,
  } = options;

  const getInitialFormData = (): {
    recipe: RecipeFormData;
    ingredients: RecipeIngredientFormData[];
  } => {
    if (enablePersistence) {
      const savedData = loadFormData(formId);
      if (savedData) {
        return savedData;
      }
    }

    return {
      recipe: {
        name: initialData?.name || "",
        description: initialData?.description || "",
        batch_size: initialData?.batch_size || null,
        batch_unit: initialData?.batch_unit || "",
        prep_time: initialData?.prep_time || "",
        instructions: initialData?.instructions || "",
      },
      ingredients: initialIngredients,
    };
  };

  const initialFormData = getInitialFormData();
  const [formData, setFormData] = useState<RecipeFormData>(
    initialFormData.recipe
  );
  const [ingredients, setIngredients] = useState<RecipeIngredientFormData[]>(
    initialFormData.ingredients
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (enablePersistence && isDirty) {
      saveFormData(formId, formData, ingredients);
    }
  }, [formData, ingredients, formId, enablePersistence, isDirty]);

  const updateField = useCallback(
    (fieldName: string, value: string | number | null) => {
      setIsDirty(true);

      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

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
      field: keyof RecipeIngredientFormData,
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
        inventory_id: "",
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
      batch_size: initialData?.batch_size || null,
      batch_unit: initialData?.batch_unit || "",
      prep_time: initialData?.prep_time || "",
      instructions: initialData?.instructions || "",
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
      onSubmit: (data: CreateRecipeData) => Promise<RecipeWithIngredients>
    ) => {
      const validationErrors = validateRecipeWithIngredients(
        formData,
        ingredients
      );
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return false;
      }

      setIsSubmitting(true);
      try {
        const submitData: CreateRecipeData = {
          ...formData,
          ingredients: ingredients.filter(
            (ing) => ing.inventory_id && ing.quantity > 0
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
      required: fieldName === "name",
    }),
    getIngredientFieldProps: (
      index: number,
      field: keyof RecipeIngredientFormData
    ) => ({
      error: !!errors[`ingredient_${index}_${field}`],
      errorMessage: errors[`ingredient_${index}_${field}`],
      required: field === "inventory_id" || field === "quantity",
    }),
    clearPersistence: () => clearFormData(formId),
  };
}
