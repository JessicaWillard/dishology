import type {
  RecipeWithIngredients,
  RecipeFormData,
} from "@/utils/types/database";
import type { InventoryOption } from "../interface";

export interface EditRecipeSectionProps {
  /**
   * The recipe being edited
   */
  editingRecipe?: RecipeWithIngredients | null;

  /**
   * Function to update an existing recipe
   */
  onUpdate: (
    id: string,
    data: Partial<RecipeFormData>
  ) => Promise<RecipeWithIngredients>;

  /**
   * Function to delete a recipe
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
   * Available inventory items for ingredient selection
   */
  availableInventory?: InventoryOption[];

  /**
   * Called when the section should be closed
   */
  onClose?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
