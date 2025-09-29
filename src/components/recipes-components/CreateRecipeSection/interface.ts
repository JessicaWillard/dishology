import type {
  RecipeWithIngredients,
  RecipeFormData,
} from "@/utils/types/database";
import type { InventoryOption } from "../interface";

export interface CreateRecipeSectionProps {
  /**
   * Function to create a new recipe
   */
  onCreate: (data: RecipeFormData) => Promise<RecipeWithIngredients>;

  /**
   * Whether the create operation is in progress
   */
  isCreating?: boolean;

  /**
   * Available inventory items for ingredient selection
   */
  availableInventory?: InventoryOption[];

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
