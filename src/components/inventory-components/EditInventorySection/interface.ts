import type {
  InventoryWithSupplier,
  InventoryFormData,
} from "@/utils/types/database";

export interface EditInventorySectionProps {
  /**
   * The inventory item being edited
   */
  editingItem?: InventoryWithSupplier | null;

  /**
   * Function to update an existing inventory item
   */
  onUpdate: (
    id: string,
    data: Partial<InventoryFormData>
  ) => Promise<InventoryWithSupplier>;

  /**
   * Function to delete an inventory item
   */
  onDelete: (id: string) => Promise<void>;

  /**
   * Whether the update operation is in progress
   */
  isUpdating?: boolean;

  /**
   * Whether the delete operation is in progress
   */
  isDeleting?: boolean;

  /**
   * Available suppliers for the supplier dropdown
   */
  suppliers?: Array<{ id: string; name: string }>;

  /**
   * Called when the section should be closed
   */
  onClose?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
