"use client";

import { useCallback } from "react";
import { clsx } from "clsx";
import { tv } from "tailwind-variants";
import type { InventoryFormProps } from "./interface";
import type { InventoryFormData } from "@/utils/types/database";
import { useInventoryForm } from "@/hooks/useInventoryForm";
import { Input } from "../../fields/Input";
import { TextArea } from "../../fields/TextArea";
import { ComboBox } from "../../fields/ComboBox";
import { Button } from "../../ui/Button";
import { Box } from "../../ui/Box";
import { Icon } from "../../ui/Icon";

const inventoryFormStyles = tv({
  base: "flex flex-col gap-6",
  variants: {
    loading: {
      true: "opacity-50 pointer-events-none",
    },
  },
});

const INVENTORY_TYPES = [
  { id: "produce", name: "Produce" },
  { id: "dry", name: "Dry Goods" },
  { id: "meat", name: "Meat" },
  { id: "dairy", name: "Dairy" },
  { id: "beverage", name: "Beverage" },
  { id: "cleaning", name: "Cleaning" },
  { id: "smallwares", name: "Smallwares" },
  { id: "equipment", name: "Equipment" },
  { id: "other", name: "Other" },
];

const UNITS = [
  { id: "kg", name: "Kg" },
  { id: "g", name: "g" },
  { id: "lb", name: "lb" },
  { id: "oz", name: "oz" },
  { id: "l", name: "L" },
  { id: "ml", name: "ml" },
];

export function InventoryForm({
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
  createSupplierUrl,
  onCreate,
  onUpdate,
  suppliers = [],
}: InventoryFormProps) {
  const {
    formData,
    isSubmitting,
    isDirty,
    updateField,
    validateFieldOnBlur,
    resetForm,
    handleSubmit,
    getFieldProps,
  } = useInventoryForm({
    initialData: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          description: initialData.description || "",
          quantity: initialData.quantity,
          size: initialData.size || "",
          unit: initialData.unit || "",
          price_per_unit: initialData.price_per_unit,
          price_per_pack: initialData.price_per_pack || "",
          supplier_id: initialData.supplier_id || "",
          location: initialData.location || "",
          min_count: initialData.min_count || "",
          count_date: initialData.count_date,
        }
      : undefined,
    onSuccess,
    onError,
    formId:
      mode === "edit" && initialData?.id ? `edit-${initialData.id}` : "create",
  });

  const handleFormSubmit = useCallback(
    async (data: InventoryFormData) => {
      if (mode === "create" && onCreate) {
        return await onCreate(data);
      } else if (mode === "edit" && onUpdate && initialData?.id) {
        return await onUpdate(initialData.id, data);
      }
      throw new Error("Invalid form configuration");
    },
    [mode, onCreate, onUpdate, initialData?.id]
  );

  const handleDelete = useCallback(async () => {
    if (mode === "edit" && initialData?.id && onDelete) {
      try {
        await onDelete(initialData.id);
        onSuccess?.(initialData);
      } catch (error) {
        onError?.(error as Error);
      }
    }
  }, [mode, initialData, onDelete, onSuccess, onError]);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
    }
    resetForm();
    onCancel?.();
  }, [isDirty, resetForm, onCancel]);

  const isFormLoading = isLoading || isSubmitting;
  const canDelete = mode === "edit" && initialData?.id && onDelete;

  // Sort suppliers alphabetically by name
  const sortedSuppliers = [...suppliers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <form
      className={clsx(
        inventoryFormStyles({ loading: isFormLoading }),
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleFormSubmit);
      }}
    >
      {/* Basic Information */}
      <Box display="flexCol" gap={4}>
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={(value, e) => updateField("name", e.target.value)}
          onBlur={(e) => validateFieldOnBlur("name", e.target.value)}
          {...getFieldProps("name")}
          placeholder="Enter inventory item name"
        />

        <ComboBox
          label="Type"
          name="type"
          items={INVENTORY_TYPES}
          selectedKey={formData.type}
          onSelectionChange={(key) => updateField("type", key as string)}
          placeholder="Select inventory type"
          {...getFieldProps("type")}
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={(value, e) => updateField("description", e.target.value)}
          onBlur={(e) => validateFieldOnBlur("description", e.target.value)}
          {...getFieldProps("description")}
          placeholder="Enter item description"
          rows={3}
        />
      </Box>

      {/* Quantity and Size */}
      <Box>
        <Box display="grid" gridCols={2} gap={4}>
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(value, e) => updateField("quantity", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("quantity", e.target.value)}
            {...getFieldProps("quantity")}
            placeholder="0"
            min="0"
            step="0.01"
          />

          <Box display="grid" gridCols={2} gap={4}>
            <Input
              label="Size"
              name="size"
              type="number"
              value={formData.size}
              onChange={(value, e) => updateField("size", e.target.value)}
              onBlur={(e) => validateFieldOnBlur("size", e.target.value)}
              {...getFieldProps("size")}
              placeholder="0"
              min="0"
              step="0.01"
            />
            <ComboBox
              label="Unit"
              name="unit"
              items={UNITS}
              selectedKey={formData.unit}
              onSelectionChange={(key) => updateField("unit", key as string)}
              placeholder="Unit"
            />
          </Box>
        </Box>
      </Box>

      {/* Pricing */}
      <Box>
        <Box display="grid" gridCols={2} gap={4}>
          <Input
            label="$ / unit"
            name="price_per_unit"
            type="number"
            value={formData.price_per_unit}
            onChange={(value, e) =>
              updateField("price_per_unit", e.target.value)
            }
            onBlur={(e) =>
              validateFieldOnBlur("price_per_unit", e.target.value)
            }
            {...getFieldProps("price_per_unit")}
            placeholder="0.00"
            min="0"
            step="0.01"
          />

          <Input
            label="$ / pack"
            name="price_per_pack"
            type="number"
            value={formData.price_per_pack}
            onChange={(value, e) =>
              updateField("price_per_pack", e.target.value)
            }
            onBlur={(e) =>
              validateFieldOnBlur("price_per_pack", e.target.value)
            }
            {...getFieldProps("price_per_pack")}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </Box>
      </Box>

      {/* Supplier and Location */}
      <Box display="flexCol" gap={4}>
        <Box display="flexRow" align="end" gap={2}>
          <ComboBox
            label="Supplier"
            name="supplier_id"
            items={sortedSuppliers}
            selectedKey={formData.supplier_id}
            onSelectionChange={(key) =>
              updateField("supplier_id", key as string)
            }
            placeholder="Select supplier"
            className="flex-1"
          />
          <Button
            type="button"
            variant="solid"
            iconOnly
            className="h-[50px] w-[50px]"
            aria-label="Add new supplier"
            href={createSupplierUrl}
          >
            <Icon name="Plus" />
          </Button>
        </Box>

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={(value, e) => updateField("location", e.target.value)}
          onBlur={(e) => validateFieldOnBlur("location", e.target.value)}
          {...getFieldProps("location")}
          placeholder="Enter storage location"
        />
      </Box>

      {/* Additional Information */}
      <Box>
        <Box display="grid" gridCols={2} gap={4}>
          <Input
            label="Min count"
            name="min_count"
            type="number"
            value={formData.min_count}
            onChange={(value, e) => updateField("min_count", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("min_count", e.target.value)}
            {...getFieldProps("min_count")}
            placeholder="0"
            min="0"
            step="0.01"
          />

          <Input
            label="Count date"
            name="count_date"
            type="date"
            value={formData.count_date}
            onChange={(value, e) => updateField("count_date", e.target.value)}
            onBlur={(e) => validateFieldOnBlur("count_date", e.target.value)}
            {...getFieldProps("count_date")}
          />
        </Box>
      </Box>

      {/* Form Actions */}
      <Box display="flexRow" justify="between" gap={3}>
        {canDelete && mode === "edit" && (
          <Button
            type="button"
            variant="destructive"
            handlePress={handleDelete}
            disabled={isFormLoading}
          >
            Delete
          </Button>
        )}

        {showCancel && mode === "create" && (
          <Button
            type="button"
            variant="ghost"
            handlePress={handleCancel}
            disabled={isFormLoading}
          >
            {cancelText}
          </Button>
        )}

        <Button
          type="submit"
          variant="solid"
          disabled={isFormLoading || !isDirty}
          isLoading={isSubmitting}
        >
          {submitText || (mode === "create" ? "Create Item" : "Update Item")}
        </Button>
      </Box>
    </form>
  );
}

InventoryForm.displayName = "InventoryForm";
