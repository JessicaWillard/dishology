import type {
  InventoryWithSupplier,
  InventoryFormData,
} from "@/utils/types/database";

export type InventoryFormMode = "create" | "edit";

export interface InventoryFormProps {
  /**
   * Form mode - determines whether we're creating or editing
   */
  mode: InventoryFormMode;

  /**
   * Initial data for edit mode
   */
  initialData?: InventoryWithSupplier;

  /**
   * Called when form is successfully submitted
   */
  onSuccess?: (inventory: InventoryWithSupplier) => void;

  /**
   * Called when form submission fails
   */
  onError?: (error: Error) => void;

  /**
   * Called when user cancels the form
   */
  onCancel?: () => void;

  /**
   * Called when user deletes the inventory item (edit mode only)
   */
  onDelete?: (id: string) => Promise<void>;

  /**
   * Whether to show the cancel button
   */
  showCancel?: boolean;

  /**
   * Custom submit button text
   */
  submitText?: string;

  /**
   * Custom cancel button text
   */
  cancelText?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether the form is in a loading state
   */
  isLoading?: boolean;

  /**
   * URL to create a new supplier
   */
  createSupplierUrl?: string;

  /**
   * Function to create a new inventory item (for create mode)
   */
  onCreate?: (data: InventoryFormData) => Promise<InventoryWithSupplier>;

  /**
   * Function to update an existing inventory item (for edit mode)
   */
  onUpdate?: (
    id: string,
    data: Partial<InventoryFormData>
  ) => Promise<InventoryWithSupplier>;

  /**
   * Available suppliers for the supplier dropdown
   */
  suppliers?: Array<{ id: string; name: string }>;
}
