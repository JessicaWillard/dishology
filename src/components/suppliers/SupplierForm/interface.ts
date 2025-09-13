import type { Supplier, SupplierFormData } from "@/utils/types/database";

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
   * Called when user deletes the supplier (edit mode only)
   */
  onDelete?: (id: string) => Promise<void>;

  /**
   * Custom submit button text
   */
  submitText?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether the form is in a loading state
   */
  isLoading?: boolean;

  /**
   * Function to create a new supplier (for create mode)
   */
  onCreate?: (data: SupplierFormData) => Promise<Supplier>;

  /**
   * Function to update an existing supplier (for edit mode)
   */
  onUpdate?: (id: string, data: Partial<SupplierFormData>) => Promise<Supplier>;
}
