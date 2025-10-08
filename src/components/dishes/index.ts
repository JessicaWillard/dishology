// Barrel exports for dish components
export { DishCard } from "./DishCard";
export { DishIngredientsTable } from "./DishIngredientsTable";
export { DishForm } from "./DishForm";
export { DishesList } from "./DishesList";
export { CreateDishSection } from "./CreateDishSection";
export { EditDishSection } from "./EditDishSection";

// Re-export types
export type {
  DishProps,
  DishCardProps,
  DishIngredientsTableProps,
  DishFormProps,
  DishIngredientWithDetails,
  DishIngredientWithInventory,
  DishIngredientWithRecipe,
  IngredientOption,
  InventoryOption,
  RecipeOption,
  DishIngredientRowProps,
  DishesListProps,
  CreateDishSectionProps,
  EditDishSectionProps,
} from "./interface";
