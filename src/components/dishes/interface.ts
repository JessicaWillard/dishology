import type { Nullable } from "../../utils/types/components";
import type {
  DishWithIngredients,
  DishIngredientFormData,
  RecipeWithIngredients,
  Inventory,
} from "../../utils/types/database";

// Base dish properties
export interface DishProps {
  id: string;
  name: string;
  description?: Nullable<string>;
  instructions?: Nullable<string>;
  prepTime?: Nullable<string>;
  sellPrice?: Nullable<number>;
  ingredients?: DishIngredientWithDetails[];
  onEdit?: (id: string) => void;
}

// Ingredient with inventory details
export interface DishIngredientWithInventory {
  id: string;
  quantity: number;
  unit?: Nullable<string>;
  inventory_id?: string;
  inventory: {
    id: string;
    name: string;
    price_per_unit: string;
    size?: Nullable<string>;
    type: Nullable<string>;
    unit?: Nullable<string>;
  };
}

// Ingredient with recipe details
export interface DishIngredientWithRecipe {
  id: string;
  quantity: number;
  unit?: Nullable<string>;
  recipe_id?: string;
  recipe: RecipeWithIngredients;
}

// Union type for both ingredient types
export type DishIngredientWithDetails =
  | DishIngredientWithInventory
  | DishIngredientWithRecipe
  | {
      id: string;
      quantity: number;
      unit?: Nullable<string>;
      inventory_id?: Nullable<string>;
      recipe_id?: Nullable<string>;
      inventory?: {
        id: string;
        name: string;
        price_per_unit: string;
        size?: Nullable<string>;
        type: Nullable<string>;
        unit?: Nullable<string>;
      } | null;
      recipe?: RecipeWithIngredients | null;
    };

// Card component props
export interface DishCardProps extends DishProps {
  isExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
  onIngredientClick?: (inventoryId?: string, recipeId?: string) => void;
}

// Ingredients table props
export interface DishIngredientsTableProps {
  ingredients: DishIngredientWithDetails[];
  showHeader?: boolean;
  onRowClick?: (inventoryId?: string, recipeId?: string) => void;
}

// Form component props
export interface DishFormProps {
  initialData?: Partial<DishWithIngredients>;
  onSubmit: (data: DishWithIngredients) => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  availableInventory?: Inventory[];
  availableRecipes?: RecipeWithIngredients[];
  mode?: "create" | "edit";
  showCancel?: boolean;
}

// Unified ingredient option for ComboBox (both inventory and recipes)
export interface IngredientOption {
  id: string;
  name: string;
  type: string; // "produce", "dairy", "meat", "recipe", etc.
  unit?: string;
  source: "inventory" | "recipe";
  price_per_unit?: string; // For inventory
  cost_per_unit?: number; // For recipes
}

export interface InventoryOption {
  id: string;
  name: string;
  type: string;
  unit?: Nullable<string>;
  price_per_unit: string;
  size?: Nullable<string>;
}

export interface RecipeOption {
  id: string;
  name: string;
  units: number;
  cost_per_unit: number;
  ingredients?: RecipeWithIngredients["ingredients"];
}

// Ingredient row props (for form)
export interface DishIngredientRowProps {
  ingredient: DishIngredientFormData;
  index: number;
  availableOptions: IngredientOption[]; // Unified list
  onUpdate: (
    index: number,
    field: keyof DishIngredientFormData,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  errors?: {
    inventory_id?: string;
    recipe_id?: string;
    quantity?: string;
    unit?: string;
  };
}

// List component props
export interface DishesListProps {
  dishes: DishWithIngredients[];
  onEdit?: (id: string) => void;
  onIngredientClick?: (inventoryId?: string, recipeId?: string) => void;
}

// Create section props
export interface CreateDishSectionProps {
  isOpen: boolean;
  onClose: () => void;
  availableInventory?: Inventory[];
  availableRecipes?: RecipeWithIngredients[];
}

// Edit section props
export interface EditDishSectionProps {
  isOpen: boolean;
  onClose: () => void;
  dishId: string;
  availableInventory?: Inventory[];
  availableRecipes?: RecipeWithIngredients[];
}
