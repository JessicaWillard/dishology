import type { RecipeWithIngredients } from "@/utils/types/database";

export interface RecipesListProps {
  /**
   * List of recipes to display
   */
  recipes: RecipeWithIngredients[];

  /**
   * Whether the recipes are loading
   */
  loading?: boolean;

  /**
   * Error message if loading failed
   */
  error?: string | null;

  /**
   * Search term for filtering recipes
   */
  searchTerm?: string;

  /**
   * Callback when a recipe should be edited
   */
  onEdit?: (recipe: RecipeWithIngredients) => void;

  /**
   * Callback when retry should be attempted
   */
  onRetry?: () => void;

  /**
   * Callback when add new recipe is clicked
   */
  onAddNew?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
