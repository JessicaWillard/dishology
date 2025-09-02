import type { Supplier, SupplierFormData } from "@/types/supplier";

export type SupplierFormMode = "create" | "edit";

export interface SupplierFormProps {
  /**
   * Form mode - determines whether we're creating or editing
   */
  mode: SupplierFormMode;

  /**
   * Initial data for edit mode
   */
  initialData?: Supplier;

  /**
   * Called when form is successfully submitted
   */
  onSuccess?: (supplier: Supplier) => void;

  /**
   * Called when form submission fails
   */
  onError?: (error: Error) => void;

  /**
   * Called when user cancels the form
   */
  onCancel?: () => void;

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
}
