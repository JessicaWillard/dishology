import { useState, useCallback, useEffect } from "react";
import type {
  InventoryFormData,
  InventoryWithSupplier,
} from "@/utils/types/database";
import {
  validateInventory,
  validateField,
  type ValidationErrors,
} from "@/utils/validation/inventory";

interface UseInventoryFormOptions {
  initialData?: Partial<InventoryFormData>;
  onSuccess?: (inventory: InventoryWithSupplier) => void;
  onError?: (error: Error) => void;
  formId?: string;
  enablePersistence?: boolean;
}

const STORAGE_PREFIX = "inventory_form_";

const getStorageKey = (formId: string) => `${STORAGE_PREFIX}${formId}`;

const saveFormData = (formId: string, data: InventoryFormData) => {
  try {
    localStorage.setItem(getStorageKey(formId), JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save form data to localStorage:", error);
  }
};

const loadFormData = (formId: string): InventoryFormData | null => {
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

export function useInventoryForm(options: UseInventoryFormOptions = {}) {
  const {
    initialData,
    onSuccess,
    onError,
    formId = "default",
    enablePersistence = true,
  } = options;

  const getInitialFormData = (): InventoryFormData => {
    if (enablePersistence) {
      const savedData = loadFormData(formId);
      if (savedData) {
        return savedData;
      }
    }

    return {
      name: initialData?.name || "",
      type: initialData?.type || "other",
      description: initialData?.description || "",
      quantity: initialData?.quantity || "0",
      size: initialData?.size || "",
      unit: initialData?.unit || "",
      price_per_unit: initialData?.price_per_unit || "0",
      price_per_pack: initialData?.price_per_pack || "",
      supplier_id: initialData?.supplier_id || "",
      location: initialData?.location || "",
      min_count: initialData?.min_count || "",
      count_date:
        initialData?.count_date || new Date().toISOString().split("T")[0],
    };
  };

  const [formData, setFormData] =
    useState<InventoryFormData>(getInitialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (enablePersistence && isDirty) {
      saveFormData(formId, formData);
    }
  }, [formData, formId, enablePersistence, isDirty]);

  const updateField = useCallback(
    (fieldName: string, value: string | number) => {
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

  const validateFieldOnBlur = useCallback(
    (fieldName: string, value: string | number) => {
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
      type: initialData?.type || "other",
      description: initialData?.description || "",
      quantity: initialData?.quantity || "0",
      size: initialData?.size || "",
      unit: initialData?.unit || "",
      price_per_unit: initialData?.price_per_unit || "0",
      price_per_pack: initialData?.price_per_pack || "",
      supplier_id: initialData?.supplier_id || "",
      location: initialData?.location || "",
      min_count: initialData?.min_count || "",
      count_date:
        initialData?.count_date || new Date().toISOString().split("T")[0],
    };

    setFormData(resetData);
    setErrors({});
    setIsDirty(false);

    if (enablePersistence) {
      clearFormData(formId);
    }
  }, [initialData, enablePersistence, formId]);

  const handleSubmit = useCallback(
    async (
      onSubmit: (data: InventoryFormData) => Promise<InventoryWithSupplier>
    ) => {
      const validationErrors = validateInventory(formData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return false;
      }

      setIsSubmitting(true);
      try {
        const result = await onSubmit(formData);
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
    [formData, onSuccess, onError, enablePersistence, formId]
  );

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    validateFieldOnBlur,
    resetForm,
    handleSubmit,
    getFieldProps: (fieldName: string) => ({
      error: !!errors[fieldName],
      errorMessage: errors[fieldName],
      required: [
        "name",
        "type",
        "quantity",
        "price_per_unit",
        "count_date",
      ].includes(fieldName),
    }),
    clearPersistence: () => clearFormData(formId),
  };
}
