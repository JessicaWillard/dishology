import type {
  InventoryWithSupplier,
  InventoryFormData,
} from "@/utils/types/database";

export interface CreateInventorySectionProps {
  /**
   * Function to create a new inventory item
   */
  onCreate: (data: InventoryFormData) => Promise<InventoryWithSupplier>;

  /**
   * Whether the create operation is in progress
   */
  isCreating?: boolean;

  /**
   * Available suppliers for the supplier dropdown
   */
  suppliers?: Array<{ id: string; name: string }>;

  /**
   * Whether the section is visible
   */
  isVisible?: boolean;

  /**
   * Called when the section should be closed
   */
  onClose?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
