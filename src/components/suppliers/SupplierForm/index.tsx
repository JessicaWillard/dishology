"use client";

import { useCallback } from "react";
import { clsx } from "clsx";
import { tv } from "tailwind-variants";
import type { SupplierFormProps } from "./interface";
import type { SupplierFormData } from "@/utils/types/database";
import { useSupplierForm } from "@/hooks/useSupplierForm";
import { deleteSupplier } from "@/utils/api/suppliers";
import { Input } from "../../fields/Input";
import { TextArea } from "../../fields/TextArea";
import { Button } from "../../ui/Button";
import { Box } from "../../ui/Box";

const supplierFormStyles = tv({
  base: "flex flex-col gap-6",
  variants: {
    loading: {
      true: "opacity-50 pointer-events-none",
    },
  },
});

export function SupplierForm({
  mode = "create",
  initialData,
  onSuccess,
  onError,
  onDelete,
  submitText,
  className,
  isLoading = false,
  onCreate,
  onUpdate,
}: SupplierFormProps) {
  // Initialize form with existing data for edit mode
  const formInitialData = initialData
    ? {
        name: initialData.name,
        description: initialData.description || "",
        contact: initialData.contact,
      }
    : undefined;

  const {
    formData,
    isSubmitting,
    isDirty,
    updateField,
    validateFieldOnBlur,
    resetForm,
    handleSubmit,
    getFieldProps,
  } = useSupplierForm({
    initialData: formInitialData,
    onSuccess,
    onError,
    formId: mode === "create" ? "create" : `edit-${initialData?.id || "new"}`,
    enablePersistence: true,
  });

  // Submit handler
  const onSubmit = useCallback(
    async (data: SupplierFormData) => {
      if (mode === "create") {
        if (!onCreate) {
          throw new Error("onCreate function is required for create mode");
        }
        return await onCreate(data);
      } else {
        if (!initialData?.id) {
          throw new Error("Cannot update supplier without ID");
        }
        if (!onUpdate) {
          throw new Error("onUpdate function is required for edit mode");
        }
        return await onUpdate(initialData.id, data);
      }
    },
    [mode, initialData?.id, onCreate, onUpdate]
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleSubmit(onSubmit);
    },
    [handleSubmit, onSubmit]
  );

  // Handle reset
  const handleReset = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        "Are you sure you want to reset the form? All unsaved changes will be lost."
      );
      if (!confirmed) return;
    }
    resetForm();
  }, [isDirty, resetForm]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    console.log("Delete button clicked", { initialData, onDelete });

    if (!initialData?.id) {
      console.log("No initial data ID found");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      if (onDelete) {
        await onDelete(initialData.id);
      } else {
        await deleteSupplier(initialData.id);
      }
      // Form will be closed by parent component after successful deletion
    } catch (error) {
      console.error("Delete error:", error);
      onError?.(error as Error);
    }
  }, [initialData, onDelete, onError]);

  const isFormLoading = isLoading || isSubmitting;
  const defaultSubmitText = mode === "create" ? "Save" : "Save Changes";

  return (
    <form
      onSubmit={handleFormSubmit}
      className={clsx(
        supplierFormStyles({ loading: isFormLoading }),
        className
      )}
      noValidate
    >
      {/* Supplier Information Section */}
      <Box display="flexCol" gap={4}>
        <Input
          name="name"
          label="Supplier Name"
          placeholder="Enter supplier name"
          value={formData.name}
          onChange={(value) => updateField("name", value)}
          onBlur={(e) => validateFieldOnBlur("name", e.target.value)}
          disabled={isFormLoading}
          {...getFieldProps("name")}
        />

        <TextArea
          name="description"
          label="Description"
          placeholder="Enter supplier description (optional)"
          value={formData.description}
          onChange={(value) => updateField("description", value)}
          onBlur={(e) => validateFieldOnBlur("description", e.target.value)}
          disabled={isFormLoading}
          rows={3}
          {...getFieldProps("description")}
        />
      </Box>

      {/* Contact Information Section */}
      <Box display="flexCol" gap={4}>
        <Input
          name="contactName"
          label="Contact name"
          placeholder="Enter contact person name"
          value={formData.contact.contactName || ""}
          onChange={(value) => updateField("contactName", value)}
          onBlur={(e) => validateFieldOnBlur("contactName", e.target.value)}
          disabled={isFormLoading}
          {...getFieldProps("contactName")}
        />

        <Input
          name="phone"
          label="Phone"
          placeholder="Enter phone number"
          value={formData.contact.phone || ""}
          onChange={(value) => updateField("phone", value)}
          onBlur={(e) => validateFieldOnBlur("phone", e.target.value)}
          disabled={isFormLoading}
          type="tel"
          {...getFieldProps("phone")}
        />

        <Input
          name="email"
          label="Email"
          placeholder="Enter email address"
          value={formData.contact.email || ""}
          onChange={(value) => updateField("email", value)}
          onBlur={(e) => validateFieldOnBlur("email", e.target.value)}
          disabled={isFormLoading}
          type="email"
          {...getFieldProps("email")}
        />

        <Input
          name="website"
          label="Website"
          placeholder="Enter website URL"
          value={formData.contact.website || ""}
          onChange={(value) => updateField("website", value)}
          onBlur={(e) => validateFieldOnBlur("website", e.target.value)}
          disabled={isFormLoading}
          type="url"
          {...getFieldProps("website")}
        />
      </Box>

      {/* Form Actions */}
      <Box display="flexRow" justify="between" gap={3}>
        {mode === "create" && (
          <Button
            type="button"
            variant="ghost"
            handlePress={handleReset}
            disabled={isFormLoading}
          >
            Reset
          </Button>
        )}

        {mode === "edit" && (
          <Button
            type="button"
            variant="destructive"
            handlePress={handleDelete}
            disabled={isFormLoading}
          >
            Delete
          </Button>
        )}

        <Button
          type="submit"
          variant="solid"
          isLoading={isSubmitting}
          disabled={isFormLoading || !isDirty}
        >
          {submitText || defaultSubmitText}
        </Button>
      </Box>
    </form>
  );
}

SupplierForm.displayName = "SupplierForm";
