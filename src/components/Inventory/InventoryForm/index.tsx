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

const inventoryFormStyles = tv({
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
  { id: "cup", name: "cup" },
  { id: "tbsp", name: "tbsp" },
  { id: "tsp", name: "tsp" },
  { id: "piece", name: "piece" },
  { id: "box", name: "box" },
  { id: "case", name: "case" },
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
  onCreate,
  onUpdate,
  suppliers = [],
}: InventoryFormProps) {
  const {
    formData,
    isSubmitting,
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
    resetForm();
    onCancel?.();
  }, [resetForm, onCancel]);

  const isFormLoading = isLoading || isSubmitting;
  const canDelete = mode === "edit" && initialData?.id && onDelete;

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
      <Box className={formSectionStyles()}>
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
      <Box className={formSectionStyles()}>
        <div className="grid grid-cols-2 gap-4">
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

          <div className="flex gap-2">
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
              className="w-24"
            />
          </div>
        </div>
      </Box>

      {/* Pricing */}
      <Box className={formSectionStyles()}>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </Box>

      {/* Supplier and Location */}
      <Box className={formSectionStyles()}>
        <div className="flex gap-2">
          <ComboBox
            label="Supplier"
            name="supplier_id"
            items={suppliers}
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
            className="mt-6 h-10 w-10 p-0"
            aria-label="Add new supplier"
          >
            +
          </Button>
        </div>

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
      <Box className={formSectionStyles()}>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </Box>

      {/* Form Actions */}
      <Box
        className={formActionsStyles({
          alignment: canDelete ? "between" : "right",
        })}
      >
        {canDelete && (
          <Button
            type="button"
            variant="ghost"
            handlePress={handleDelete}
            disabled={isFormLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        )}

        <div className="flex gap-3">
          {showCancel && (
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
            disabled={isFormLoading}
            isLoading={isSubmitting}
          >
            {submitText || (mode === "create" ? "Create Item" : "Update Item")}
          </Button>
        </div>
      </Box>
    </form>
  );
}

InventoryForm.displayName = "InventoryForm";
