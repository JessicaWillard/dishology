import type { Nullable } from "../../utils/types/components";
import type {
  RecipeWithIngredients,
  RecipeIngredientFormData,
} from "../../utils/types/database";

export interface RecipeProps {
  id: string;
  name: string;
  description?: Nullable<string>;
  batchSize?: Nullable<number>;
  batchUnit?: Nullable<string>;
  units?: Nullable<number>; // Number of individual servings/units in the batch
  prepTime?: Nullable<string>;
  instructions?: Nullable<string>;
  ingredients?: RecipeIngredientWithInventory[];
  onEdit?: (id: string) => void;
}

export interface RecipeIngredientWithInventory {
  id: string;
  quantity: number;
  unit?: Nullable<string>;
  inventory: {
    id: string;
    name: string;
    price_per_unit: string;
    type: string;
    unit?: Nullable<string>;
  };
}

export interface RecipeCardProps extends RecipeProps {
  isExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
}

export interface RecipeIngredientsTableProps {
  ingredients: RecipeIngredientWithInventory[];
  showHeader?: boolean;
}

export interface RecipeFormProps {
  initialData?: Partial<RecipeWithIngredients>;
  onSubmit: (data: RecipeWithIngredients) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  availableInventory?: InventoryOption[];
}

export interface InventoryOption {
  id: string;
  name: string;
  type: string;
  unit?: Nullable<string>;
  price_per_unit: string;
}

export interface RecipeIngredientRowProps {
  ingredient: RecipeIngredientFormData;
  index: number;
  availableInventory: InventoryOption[];
  onUpdate: (
    index: number,
    field: keyof RecipeIngredientFormData,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  errors?: {
    inventory_id?: string;
    quantity?: string;
    unit?: string;
  };
}
