import { useState, useCallback } from "react";
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
}

export function useSupplierForm(options: UseSupplierFormOptions = {}) {
  const { initialData, onSuccess, onError } = options;

  // Initialize form data with proper structure
  const [formData, setFormData] = useState<SupplierFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    contact: {
      contactName: initialData?.contact?.contactName || "",
      phone: initialData?.contact?.phone || "",
      email: initialData?.contact?.email || "",
      website: initialData?.contact?.website || "",
    },
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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
    setFormData({
      name: initialData?.name || "",
      description: initialData?.description || "",
      contact: {
        contactName: initialData?.contact?.contactName || "",
        phone: initialData?.contact?.phone || "",
        email: initialData?.contact?.email || "",
        website: initialData?.contact?.website || "",
      },
    });
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

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
    [formData, onSuccess, onError]
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
  };
}
