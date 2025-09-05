"use client";

import { useCallback } from "react";
import { clsx } from "clsx";
import { tv } from "tailwind-variants";
import type { SupplierFormProps } from "./interface";
import type { SupplierFormData } from "@/utils/types/database";
import { useSupplierForm } from "@/hooks/useSupplierForm";
import { deleteSupplier } from "@/utils/api/suppliers";
import { Input } from "../fields/Input";
import { TextArea } from "../fields/TextArea";
import { Button } from "../Button";
import { Box } from "../Box";

const supplierFormStyles = tv({
  base: "flex flex-col gap-6",
  variants: {
    loading: {
      true: "opacity-50 pointer-events-none",
    },
  },
});

const formSectionStyles = tv({
  base: "flex flex-col gap-4",
});

const formActionsStyles = tv({
  base: "flex items-center gap-3 pt-2",
  variants: {
    alignment: {
      left: "justify-start",
      right: "justify-end",
      center: "justify-center",
      between: "justify-between",
    },
  },
  defaultVariants: {
    alignment: "right",
  },
});

export function SupplierForm({
  mode = "create",
  initialData,
  onSuccess,
  onError,
  onCancel,
  onDelete,
  showCancel = true,
  submitText,
  cancelText = "Cancel",
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

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (isDirty) {
      // Could add confirmation dialog here
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
    }
    resetForm();
    onCancel?.();
  }, [isDirty, resetForm, onCancel]);

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
      // Close the form after successful deletion
      onCancel?.();
    } catch (error) {
      console.error("Delete error:", error);
      onError?.(error as Error);
    }
  }, [initialData, onDelete, onCancel, onError]);

  const isFormLoading = isLoading || isSubmitting;
  const defaultSubmitText = mode === "create" ? "Save" : "Save Changes";

  return (
    <Box padding="lg" radius="md" shadow="md" width="full">
      <form
        onSubmit={handleFormSubmit}
        className={clsx(
          supplierFormStyles({ loading: isFormLoading }),
          className
        )}
        noValidate
      >
        {/* Supplier Information Section */}
        <div className={formSectionStyles()}>
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
        </div>

        {/* Contact Information Section */}
        <div className={formSectionStyles()}>
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
        </div>

        {/* Form Actions */}
        <div
          className={formActionsStyles({
            alignment:
              (showCancel && mode === "create") || mode === "edit"
                ? "between"
                : "right",
          })}
        >
          {mode === "create" && showCancel && (
            <Button
              type="button"
              variant="outline"
              handlePress={handleCancel}
              disabled={isFormLoading}
            >
              {cancelText}
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
        </div>
      </form>
    </Box>
  );
}

SupplierForm.displayName = "SupplierForm";
