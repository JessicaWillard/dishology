import { useState, useCallback, useEffect } from "react";
import type { SupplierFormData, Supplier } from "@/utils/types/database";
import {
  validateSupplier,
  validateField,
  type ValidationErrors,
} from "@/utils/validation/supplier";

interface UseSupplierFormOptions {
  initialData?: Partial<SupplierFormData>;
  onSuccess?: (supplier: Supplier) => void;
  onError?: (error: Error) => void;
  /**
   * Unique identifier for this form instance (e.g., 'create', 'edit-123')
   * Used for localStorage persistence
   */
  formId?: string;
  /**
   * Whether to enable form persistence (default: true)
   */
  enablePersistence?: boolean;
}

// localStorage utilities for form persistence
const STORAGE_PREFIX = "supplier_form_";

const getStorageKey = (formId: string) => `${STORAGE_PREFIX}${formId}`;

const saveFormData = (formId: string, data: SupplierFormData) => {
  try {
    localStorage.setItem(getStorageKey(formId), JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save form data to localStorage:", error);
  }
};

const loadFormData = (formId: string): SupplierFormData | null => {
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

const clearAllFormData = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear all form data from localStorage:", error);
  }
};

export function useSupplierForm(options: UseSupplierFormOptions = {}) {
  const {
    initialData,
    onSuccess,
    onError,
    formId = "default",
    enablePersistence = true,
  } = options;

  // Initialize form data with proper structure
  // Priority: saved data > initial data > defaults
  const getInitialFormData = (): SupplierFormData => {
    if (enablePersistence) {
      const savedData = loadFormData(formId);
      if (savedData) {
        return savedData;
      }
    }

    return {
      name: initialData?.name || "",
      description: initialData?.description || "",
      contact: {
        contactName: initialData?.contact?.contactName || "",
        phone: initialData?.contact?.phone || "",
        email: initialData?.contact?.email || "",
        website: initialData?.contact?.website || "",
      },
    };
  };

  const [formData, setFormData] =
    useState<SupplierFormData>(getInitialFormData);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (enablePersistence && isDirty) {
      saveFormData(formId, formData);
    }
  }, [formData, formId, enablePersistence, isDirty]);

  // Update form field values
  const updateField = useCallback(
    (fieldName: string, value: string) => {
      setIsDirty(true);

      if (fieldName === "name" || fieldName === "description") {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: value,
        }));
      } else {
        // Contact fields
        setFormData((prev) => ({
          ...prev,
          contact: {
            ...prev.contact,
            [fieldName]: value,
          },
        }));
      }

      // Clear any existing error for this field
      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }
    },
    [errors]
  );

  // Validate single field on blur
  const validateFieldOnBlur = useCallback(
    (fieldName: string, value: string) => {
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

  // Reset form to initial state
  const resetForm = useCallback(() => {
    const resetData = {
      name: initialData?.name || "",
      description: initialData?.description || "",
      contact: {
        contactName: initialData?.contact?.contactName || "",
        phone: initialData?.contact?.phone || "",
        email: initialData?.contact?.email || "",
        website: initialData?.contact?.website || "",
      },
    };

    setFormData(resetData);
    setErrors({});
    setIsDirty(false);

    // Clear persisted data
    if (enablePersistence) {
      clearFormData(formId);
    }
  }, [initialData, enablePersistence, formId]);

  // Submit form
  const handleSubmit = useCallback(
    async (onSubmit: (data: SupplierFormData) => Promise<Supplier>) => {
      // Validate all fields
      const validationErrors = validateSupplier(formData);
      setErrors(validationErrors);

      // If there are validation errors, don't submit
      if (Object.keys(validationErrors).length > 0) {
        return false;
      }

      setIsSubmitting(true);
      try {
        const result = await onSubmit(formData);
        onSuccess?.(result);
        setIsDirty(false);

        // Clear persisted data on successful submission
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
    // Helper getters for form fields
    getFieldProps: (fieldName: string) => ({
      error: !!errors[fieldName],
      errorMessage: errors[fieldName],
      required: fieldName === "name", // Only name is required
    }),
    // Persistence utilities
    clearPersistence: () => clearFormData(formId),
    clearAllPersistence: clearAllFormData,
  };
}
