# Dish Section Implementation Plan

## Overview

This document outlines the complete implementation plan for the dish section of the Dishology application. The implementation follows the same patterns established by the recipes section while adapting to dish-specific requirements. A **dish** represents a single menu item sold to customers, while **recipes** are kitchen components (e.g., pizza dough is a recipe, pizza is a dish).

## Current State Analysis

### ✅ What Exists

- **Database Tables**: `dishes`, `dish_ingredients` (junction table supporting both inventory and recipe references)
- **TypeScript Types**: `Dish`, `DishIngredient`, `DishWithIngredients`, `DishFormData`
- **Navigation**: Dishes icon and route in NavBar
- **Component Structure**: Empty `dishes/` folder
- **Database Schema**: Complete with proper relationships supporting both inventory and recipe ingredients

### ❌ What's Missing

- API routes for dishes and dish ingredients
- React Query hooks for data management
- All UI components (cards, forms, tables)
- Pages and client components
- Validation schemas
- Cost calculation logic for mixed inventory/recipe ingredients
- Profit and margin calculation utilities

## Component Specifications

### DishCard Component

**Two States: Collapsed (default) and Expanded**

#### Collapsed State

- **Header**:
  - Dish name (large, bold text)
  - Description (smaller, gray text)
  - Toggle button (top right, expand/collapse icon)
- **Key Metrics Row**:
  - Cost (e.g., "$12.50" - total ingredient cost)
  - Sell price (e.g., "$28.00")
  - Profit (e.g., "$15.50")
  - Margin (highlighted in green box, e.g., "55.35%")
- **Footer**:
  - Edit button (bottom left, green text)

#### Expanded State

- **All collapsed content plus**:
- **Ingredients Table**:
  - Shows both inventory items AND recipe components
  - Columns: Item, Type (Inventory/Recipe), Qty, Total Cost
  - Shows low stock indicators for inventory items
  - Displays individual ingredient/recipe costs
- **Instructions Section**:
  - Title: "Instructions"
  - Numbered list of steps

### DishIngredientsTable Component

**Enhanced Table Supporting Mixed Ingredient Types**

- **Columns**:
  - Item name (from inventory or recipe)
  - Type (shown with color-coded badge: produce, dairy, meat, or "recipe")
  - Quantity with unit
  - Total cost (quantity × price/cost per unit)
- **Features**:
  - Color-coded by type matching inventory table styling
  - Recipes use default styling (no special color)
  - Low stock indicators (for inventory items only)
  - Recipe cost display (cost per unit × quantity)
  - Cost calculations
  - Responsive design
- **Data Source**: Dish ingredients with joined inventory AND recipe data
- **Visual Design**: Inventory items have colored left border by type; recipes use default border

### DishForm Component

**Form with Cost Analysis Section**

#### Main Form Sections

1. **Dish Details**

   - Name (required)
   - Description (optional)
   - Instructions (optional, multiline)
   - Prep time (optional, e.g., "5m", "1h 15m")
   - Sell price (required, currency input)

2. **Ingredients** (similar to recipe form but enhanced)

   - Add ingredient button
   - Each row has:
     - Item selector (ComboBox with unified list of inventory + recipes)
       - Inventory items displayed with their type (produce, dairy, meat, etc.)
       - Recipe items displayed with type "recipe"
       - Inventory items color-coded by type, recipes use default color
     - Quantity (number input)
     - Unit (auto-filled from inventory/recipe, or manual)
     - Remove button

3. **Ingredient Cost List** (auto-generated, read-only)

   - Displays below ingredient inputs
   - Shows:
     - Each ingredient/recipe name
     - Quantity with unit
     - Individual cost
     - Running total at bottom
   - Auto-updates as ingredients change

4. **Cost Analysis Section** (at form bottom)
   - Total Cost (from ingredients, bold)
   - Sell Price (from form input, bold)
   - Profit (sell price - cost, bold, colored green if positive)
   - Profit Margin ((profit / sell_price) × 100, bold, colored green if positive)
   - Visual comparison bar or metrics display

## Implementation Phases

### Phase 1: API Layer (Foundation)

#### Files to Create

1. `src/app/api/dishes/route.ts`

   - `GET /api/dishes` - List all dishes with ingredients (inventory + recipes)
   - `POST /api/dishes` - Create new dish with mixed ingredients

2. `src/app/api/dishes/[id]/route.ts`

   - `GET /api/dishes/[id]` - Get single dish with ingredients
   - `PUT /api/dishes/[id]` - Update dish and ingredients
   - `DELETE /api/dishes/[id]` - Delete dish and ingredients

3. `src/utils/api/dishes.ts`

   - Client API utilities
   - Error handling
   - Type-safe API calls

4. `src/utils/validation/dish.ts`
   - Dish form validation
   - Ingredient validation (both inventory and recipe)
   - Cost and margin calculation validation
   - Sell price validation

#### Key API Considerations

- **Mixed Ingredient Types**: Handle both `inventory_id` and `recipe_id` in `dish_ingredients` table
- **Cost Calculations**:
  - Inventory items: `quantity × (price_per_unit / size)`
  - Recipe items: `quantity × cost_per_unit` (where cost_per_unit is calculated from recipe's total_cost / units)
- **Recipe Cost Lookup**: Fetch recipe with ingredients to calculate its cost_per_unit
- **Ingredient Filtering**:
  - Inventory: Only include types: `produce`, `dry`, `meat`, `dairy`, `beverage`, `other`
  - Recipes: All recipes available
- **Data Joins**: Efficiently fetch dishes with ingredients, including both inventory and recipe data
- **Profit Calculations**: `profit = sell_price - total_cost`, `margin = (profit / sell_price) × 100`

### Phase 2: Utility Functions

#### Files to Create

1. `src/utils/dishCalculations.ts`
   - Cost calculation utilities for mixed ingredients
   - Profit calculation: `sell_price - total_cost`
   - Margin calculation: `(profit / sell_price) × 100`
   - Recipe cost per unit calculation

#### Key Functions

```typescript
// Calculate dish cost from mixed ingredients
const calculateDishCost = (
  ingredients: DishIngredientWithDetails[]
): number => {
  return ingredients.reduce((total, ingredient) => {
    if (ingredient.inventory_id) {
      // Inventory item cost
      const pricePerUnit = parseFloat(ingredient.inventory.price_per_unit);
      const size = parseFloat(ingredient.inventory.size || "1");
      return total + (pricePerUnit / size) * ingredient.quantity;
    } else if (ingredient.recipe_id) {
      // Recipe cost (cost per unit × quantity)
      const recipeCostPerUnit = calculateRecipeCostPerUnit(ingredient.recipe);
      return total + recipeCostPerUnit * ingredient.quantity;
    }
    return total;
  }, 0);
};

// Calculate recipe cost per unit for use in dish
const calculateRecipeCostPerUnit = (recipe: RecipeWithIngredients): number => {
  const totalRecipeCost = calculateRecipeCost(recipe.ingredients);
  return recipe.units > 0 ? totalRecipeCost / recipe.units : 0;
};

// Calculate profit
const calculateProfit = (sellPrice: number, cost: number): number => {
  return sellPrice - cost;
};

// Calculate profit margin (percentage)
const calculateMargin = (profit: number, sellPrice: number): number => {
  return sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
};
```

### Phase 3: Data Management

#### Files to Create

1. `src/hooks/useDishesQuery.ts`

   - React Query hooks for CRUD operations
   - Optimistic updates
   - Cache management
   - Invalidation of related queries (recipes, inventory)

2. `src/hooks/useDishForm.ts`
   - Form state management
   - Mixed ingredient handling
   - Validation handling
   - Cost/profit calculations
   - Persistence (localStorage)

#### Key Features

- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Real-time Cost Calculation**: Auto-calculate cost as ingredients change
- **Real-time Profit/Margin**: Auto-calculate profit and margin when cost or sell price changes
- **Form Persistence**: Save form data to localStorage with unique formIds (see Lessons Learned pattern)
- **Validation**: Real-time field validation
- **Mixed Ingredient State**: Manage both inventory and recipe ingredients in unified state

### Phase 4: Core Components

#### Files to Create

1. `src/components/dishes/DishCard/`

   - `index.tsx` - Main card component
   - `dishCard.stories.tsx` - Storybook stories

2. `src/components/dishes/DishIngredientsTable/`

   - `index.tsx` - Enhanced ingredients table

3. `src/components/dishes/DishForm/`

   - `index.tsx` - Form component with cost analysis

4. `src/components/dishes/interface.ts`

   - **Shared interfaces for all dish components** (following `recipes-components/interface.ts` pattern)
   - Core types:
     - `DishProps` - Base dish properties
     - `DishIngredientWithInventory` - Ingredient from inventory
     - `DishIngredientWithRecipe` - Ingredient from recipe
     - `DishIngredientWithDetails` - Union type for both
   - Component props:
     - `DishCardProps` - Card component props
     - `DishIngredientsTableProps` - Table props
     - `DishFormProps` - Form props
     - `DishIngredientRowProps` - Ingredient row props
   - Helper types:
     - `IngredientOption` - Unified inventory + recipes for ComboBox
     - `DishListProps`, `CreateDishSectionProps`, `EditDishSectionProps`

5. `src/components/dishes/theme.ts`
   - Styling and variants
   - Cost analysis section styles
   - Profit/margin display styles

#### Component Architecture

- **Shared Interfaces**: All component props in `src/components/dishes/interface.ts` (following recipes pattern)
- **Component-Specific Interfaces**: Only create separate `interface.ts` in subdirectories if truly component-specific
- **Tailwind Variants**: Consistent styling patterns via `theme.ts`
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive Design**: Mobile-first approach
- **Cost Display**: Color-coded profit indicators (green for positive, red for negative)

### Phase 5: Management Components

#### Files to Create

1. `src/components/dishes/CreateDishSection/`

   - `index.tsx` - Create dish panel

2. `src/components/dishes/EditDishSection/`

   - `index.tsx` - Edit dish panel

3. `src/components/dishes/DishesList/`

   - `index.tsx` - Dish list component

4. `src/components/dishes/index.ts`
   - Barrel exports for components
   - Re-export types: `export type { DishProps, DishCardProps, ... } from "./interface"`

#### Key Features

- **Card-Only Display**: No table view, only DishCard components
- **Alphabetical Sorting**: Dishes sorted by name A-Z
- **Side Panels**: Consistent with inventory and recipe implementations
- **Form Management**: Reusable form components
- **Error Handling**: User-friendly error messages
- **Loading States**: Proper loading indicators
- **Cost Analysis Visibility**: Always visible in forms for real-time feedback

### Phase 6: Pages and Integration

#### Files to Create

1. `src/app/dishes/page.tsx`

   - Server component with authentication
   - Redirect logic for unauthorized users

2. `src/app/dishes/client.tsx`
   - Client component with state management
   - Card-only display (no view switching)
   - Search functionality
   - Alphabetical sorting
   - Profit/margin filtering (optional)

#### Integration Points

- **Navigation**: Dishes route already exists in NavBar
- **Routing**: Proper Next.js 13+ app router integration
- **Authentication**: Clerk integration for user management
- **Related Data**: Fetch both recipes and inventory for ingredient selection

### Phase 7: Advanced Features

#### Files to Create/Update

1. Export functionality

   - CSV export for dishes with profit analysis
   - Dish profitability reports

2. Performance optimizations
   - Cache recipe costs to avoid recalculation
   - Optimize mixed ingredient queries

## Technical Specifications

### Cost Calculation Strategy

```typescript
// Dish cost = sum of inventory costs + recipe costs
interface DishIngredientWithDetails {
  inventory_id?: string;
  recipe_id?: string;
  quantity: number;
  unit?: string;
  inventory?: Inventory;
  recipe?: RecipeWithIngredients;
}

const calculateDishCost = (
  ingredients: DishIngredientWithDetails[]
): number => {
  return ingredients.reduce((total, ingredient) => {
    // Inventory item
    if (ingredient.inventory_id && ingredient.inventory) {
      const pricePerUnit = parseFloat(ingredient.inventory.price_per_unit);
      const size = parseFloat(ingredient.inventory.size || "1");
      const costPerSmallestUnit = pricePerUnit / size;
      return total + costPerSmallestUnit * ingredient.quantity;
    }

    // Recipe item
    if (ingredient.recipe_id && ingredient.recipe) {
      const recipeTotalCost = calculateRecipeCost(
        ingredient.recipe.ingredients
      );
      const recipeCostPerUnit =
        ingredient.recipe.units > 0
          ? recipeTotalCost / ingredient.recipe.units
          : 0;
      return total + recipeCostPerUnit * ingredient.quantity;
    }

    return total;
  }, 0);
};

// Profit and margin
const calculateProfit = (sellPrice: number, cost: number) => {
  return sellPrice - cost;
};

const calculateMargin = (profit: number, sellPrice: number) => {
  return sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
};
```

### Ingredient Type Handling

```typescript
// Unified ingredient option for ComboBox
interface IngredientOption {
  id: string;
  name: string;
  type: string; // "produce", "dairy", "meat", "recipe", etc.
  unit?: string;
  source: "inventory" | "recipe"; // Internal flag to determine which ID to use
  price_per_unit?: string; // For inventory items
  cost_per_unit?: number; // For recipe items (calculated)
}

// Form state for each ingredient
interface DishIngredientFormData {
  // Only ONE of these will be set based on selection
  inventory_id?: string;
  recipe_id?: string;
  quantity: number;
  unit?: string;
  source: "inventory" | "recipe"; // Track which source this ingredient is from
}

// Build unified options list
const buildIngredientOptions = (
  inventory: Inventory[],
  recipes: RecipeWithIngredients[]
): IngredientOption[] => {
  const inventoryOptions = inventory
    .filter((item) => ALLOWED_INVENTORY_TYPES.includes(item.type))
    .map((item) => ({
      id: item.id,
      name: `${item.name} (${item.type})`,
      type: item.type,
      unit: item.unit,
      source: "inventory" as const,
      price_per_unit: item.price_per_unit,
    }));

  const recipeOptions = recipes.map((recipe) => ({
    id: recipe.id,
    name: `${recipe.name} (recipe)`,
    type: "recipe",
    unit: "units",
    source: "recipe" as const,
    cost_per_unit: calculateRecipeCostPerUnit(recipe),
  }));

  return [...inventoryOptions, ...recipeOptions].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};
```

### Ingredient Filtering

```typescript
// Inventory items for dish ingredients (same as recipes)
const ALLOWED_INVENTORY_TYPES = [
  "produce",
  "dry",
  "meat",
  "dairy",
  "beverage",
  "other",
] as const;

// All recipes available for dishes
const getAvailableRecipes = async (userId: string) => {
  // Fetch all recipes for user
  return await fetchRecipesWithCostCalculation(userId);
};
```

### Database Queries

```sql
-- Get dish with mixed ingredients
SELECT
  d.*,
  di.quantity as ingredient_quantity,
  di.unit as ingredient_unit,
  di.inventory_id,
  di.recipe_id,
  i.name as inventory_name,
  i.price_per_unit,
  i.size,
  i.type as inventory_type,
  r.name as recipe_name,
  r.units as recipe_units
FROM dishes d
LEFT JOIN dish_ingredients di ON d.id = di.dish_id
LEFT JOIN inventory i ON di.inventory_id = i.id
LEFT JOIN recipes r ON di.recipe_id = r.id
WHERE d.user_id = $1
ORDER BY d.name ASC;

-- For recipe ingredients, we need to fetch recipe details
-- including its own ingredients to calculate cost_per_unit
SELECT
  r.*,
  ri.quantity,
  ri.unit,
  inv.price_per_unit,
  inv.size
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
LEFT JOIN inventory inv ON ri.inventory_id = inv.id
WHERE r.id = $1;
```

## Data Structure Specifications

### Database Schema (Already Exists)

```typescript
// Dish table
interface Dish {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  instructions?: string;
  prep_time?: string;
  sell_price?: number; // IMPORTANT: This is stored in DB
  created_at?: string;
}

// Dish ingredients junction table
interface DishIngredient {
  id: string;
  dish_id: string;
  inventory_id?: string; // Nullable - for inventory items
  recipe_id?: string; // Nullable - for recipe components
  quantity: number;
  unit?: string;
  created_at?: string;
}
```

### Extended Types for Components

All these types should be defined in `src/components/dishes/interface.ts`:

```typescript
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
  inventory: {
    id: string;
    name: string;
    price_per_unit: string;
    size?: Nullable<string>;
    type: string;
    unit?: Nullable<string>;
  };
}

// Ingredient with recipe details
export interface DishIngredientWithRecipe {
  id: string;
  quantity: number;
  unit?: Nullable<string>;
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
      inventory?: Inventory;
      recipe?: RecipeWithIngredients;
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
  availableInventory?: InventoryOption[];
  availableRecipes?: RecipeOption[];
  mode?: "create" | "edit";
  showCancel?: boolean;
}

// Unified ingredient option for ComboBox
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
}

export interface RecipeOption {
  id: string;
  name: string;
  units: number;
  cost_per_unit: number;
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
```

## Questions & Decisions

### 1. Recipe Cost Caching Strategy

**Decision**: Initially, calculate recipe cost on-the-fly by fetching recipe ingredients. In a future optimization, we can:

- Cache `cost_per_unit` on the recipes table
- Update it when recipe ingredients change
- This avoids deep joins for dishes

**Current Approach**: Calculate dynamically for accuracy

### 2. Sell Price Requirement

**Decision**: `sell_price` is required for dishes since profit/margin calculations are core features. Form validation will enforce this.

### 3. Negative Margins Handling

**Decision**: Allow negative margins (when cost > sell price) but display them in red with warning indicators. This helps users identify unprofitable dishes.

### 4. Ingredient Unit Display

**Decision**:

- For inventory items: Use inventory unit (auto-filled)
- For recipe items: Use "units" or "servings" terminology
- Both editable if needed for flexibility

### 5. Cost Analysis Display

**Decision**: Cost analysis section is always visible in the form (not collapsed) to provide constant feedback as users build the dish.

### 6. Search and Filtering

**Decision**: Follow recipe pattern:

- Search by dish name, description
- Optional future filters: by margin range, by profitability

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── dishes/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   └── dishes/
│       ├── page.tsx
│       └── client.tsx
├── components/
│   └── dishes/
│       ├── DishCard/
│       │   ├── index.tsx
│       │   └── dishCard.stories.tsx
│       ├── DishIngredientsTable/
│       │   └── index.tsx
│       ├── DishForm/
│       │   └── index.tsx
│       ├── CreateDishSection/
│       │   └── index.tsx
│       ├── EditDishSection/
│       │   └── index.tsx
│       ├── DishesList/
│       │   └── index.tsx
│       ├── interface.ts  ← Shared interfaces for all dish components
│       ├── theme.ts
│       └── index.ts
├── hooks/
│   ├── useDishesQuery.ts
│   └── useDishForm.ts
└── utils/
    ├── api/
    │   └── dishes.ts
    ├── validation/
    │   └── dish.ts
    └── dishCalculations.ts
```

## Success Criteria

### Phase 1 Complete

- [ ] API routes handle all CRUD operations for dishes
- [ ] Mixed ingredient types (inventory + recipes) work correctly
- [ ] Cost calculations work for both ingredient types
- [ ] Profit and margin calculations are accurate
- [ ] Database queries are optimized
- [ ] Error handling is comprehensive

### Phase 2 Complete

- [ ] Cost calculation utilities handle mixed ingredients
- [ ] Recipe cost per unit calculation works
- [ ] Profit calculation is correct
- [ ] Margin calculation follows formula: (profit / sell_price) × 100
- [ ] Edge cases handled (negative margins, zero prices, etc.)

### Phase 3 Complete

- [ ] React Query hooks provide optimistic updates
- [ ] Form management handles mixed ingredients
- [ ] Real-time cost/profit/margin calculations work
- [ ] Data persistence works correctly
- [ ] Cache invalidation is proper

### Phase 4 Complete

- [ ] DishCard displays correctly in both states
- [ ] Cost, sell price, profit, margin display properly
- [ ] Color coding for profit/margin works (green/red)
- [ ] DishIngredientsTable shows mixed ingredient types
- [ ] Type badges (Inventory/Recipe) display correctly
- [ ] DishForm handles all input types
- [ ] Cost analysis section auto-updates
- [ ] Components are accessible and responsive

### Phase 5 Complete

- [ ] Create/Edit panels work seamlessly
- [ ] DishesList displays data correctly
- [ ] All components integrate properly
- [ ] Error states are handled gracefully
- [ ] Form validation works for all fields
- [ ] Sell price is required and validated

### Phase 6 Complete

- [ ] Dishes page loads and functions correctly
- [ ] Dishes display as cards only (no table view)
- [ ] Dishes are sorted alphabetically by name
- [ ] Navigation integration works
- [ ] Authentication is properly handled
- [ ] Mobile experience is smooth
- [ ] Search functionality works

### Phase 7 Complete

- [ ] Export functionality is implemented
- [ ] Performance is optimized
- [ ] Recipe cost calculation is efficient
- [ ] All edge cases are handled

## Lessons Learned & Critical Patterns

### 1. Form Persistence with localStorage (CRITICAL)

**MUST FOLLOW** the same pattern as recipes and inventory:

```typescript
// In DishForm component
const { formData, ...formMethods } = useDishForm({
  initialData,
  formId:
    mode === "edit" && initialData?.id ? `edit-${initialData.id}` : "create",
});
```

**localStorage Keys**:

- Create mode: `dish_form_create`
- Edit mode: `dish_form_edit-{dishId}`

See detailed explanation in [RECIPE_IMPLEMENTATION_PLAN.md#lessons-learned](../RECIPE_IMPLEMENTATION_PLAN.md#lessons-learned)

### 2. Unified Ingredient Selection (Inventory + Recipes)

**Key Pattern**: Single ComboBox with unified options list, color-coded by type:

```typescript
// Build unified options for the ingredient selector
const ingredientOptions = [
  ...inventory
    .filter((item) => ALLOWED_TYPES.includes(item.type))
    .map((item) => ({
      id: item.id,
      name: `${item.name} (${item.type})`,
      type: item.type, // "produce", "dairy", "meat", etc.
      source: "inventory",
      unit: item.unit,
    })),
  ...recipes.map((recipe) => ({
    id: recipe.id,
    name: `${recipe.name} (recipe)`,
    type: "recipe",
    source: "recipe",
    unit: "units",
  })),
].sort((a, b) => a.name.localeCompare(b.name));

// When user selects an item
const handleIngredientSelect = (selectedId: string) => {
  const selected = ingredientOptions.find((opt) => opt.id === selectedId);

  if (selected.source === "inventory") {
    updateIngredient(index, {
      inventory_id: selected.id,
      recipe_id: undefined,
      unit: selected.unit,
    });
  } else {
    updateIngredient(index, {
      recipe_id: selected.id,
      inventory_id: undefined,
      unit: selected.unit,
    });
  }
};

// Color coding by type (matching inventory table colors)
const getTypeColor = (type: string) => {
  const colors = {
    produce: "bg-produce-light border-produce",
    dry: "bg-dry-light border-dry",
    meat: "bg-meat-light border-meat",
    dairy: "bg-dairy-light border-dairy",
    beverage: "bg-beverage-light border-beverage",
    cleaning: "bg-cleaning-light border-cleaning",
    smallwares: "bg-smallwares-light border-smallwares",
    equipment: "bg-equipment-light border-equipment",
    other: "bg-other-light border-other",
  };
  // Recipes and unknown types use default
  return colors[type] || "bg-white border-gray-light";
};
```

**UX Benefits**:

- Single step selection instead of two-step (type → item)
- Visual distinction through color coding for inventory types
- Recipes use default styling for clear differentiation
- Alphabetically sorted for easy finding
- Clear labeling with type in parentheses

### 3. Real-time Cost Calculations

**Pattern**: Calculate costs in the form hook and expose them to the form component:

```typescript
// In useDishForm
const calculateCosts = () => {
  const totalCost = calculateDishCost(ingredients);
  const profit = formData.sell_price ? formData.sell_price - totalCost : 0;
  const margin = formData.sell_price ? (profit / formData.sell_price) * 100 : 0;

  return { totalCost, profit, margin };
};

// Update whenever ingredients or sell_price changes
useEffect(() => {
  const { totalCost, profit, margin } = calculateCosts();
  // Update state or expose via return values
}, [ingredients, formData.sell_price]);
```

### 4. Recipe Cost Lookup

**Pattern**: When fetching dishes, include recipe details for cost calculation:

```typescript
// In API route
const dishWithIngredients = await fetchDishWithIngredients(id);

// For each ingredient that's a recipe, fetch its ingredients too
for (const ingredient of dishWithIngredients.ingredients) {
  if (ingredient.recipe_id) {
    ingredient.recipe = await fetchRecipeWithIngredients(ingredient.recipe_id);
  }
}
```

### 5. Cost Analysis Display

**UX Pattern**: Always show cost analysis in forms (not collapsed):

```tsx
{
  /* Cost Analysis - Always visible */
}
<Box className="bg-gray-50 p-4 rounded-lg">
  <Text size="lg" weight="bold" className="mb-4">
    Cost Analysis
  </Text>

  <Box display="flexRow" justify="between">
    <Text>Total Cost</Text>
    <Text weight="bold">${totalCost.toFixed(2)}</Text>
  </Box>

  <Box display="flexRow" justify="between">
    <Text>Sell Price</Text>
    <Text weight="bold">${sellPrice.toFixed(2)}</Text>
  </Box>

  <Box display="flexRow" justify="between">
    <Text>Profit</Text>
    <Text
      weight="bold"
      className={profit >= 0 ? "text-green-600" : "text-red-600"}
    >
      ${profit.toFixed(2)}
    </Text>
  </Box>

  <Box display="flexRow" justify="between">
    <Text>Profit Margin</Text>
    <Text
      weight="bold"
      className={margin >= 0 ? "text-green-600" : "text-red-600"}
    >
      {margin.toFixed(2)}%
    </Text>
  </Box>
</Box>;
```

## Implementation Order Recommendation

1. **Start with Phase 2 (Utilities)** - Create `dishCalculations.ts` first since cost logic is complex
2. **Phase 1 (API)** - Build API routes with proper mixed ingredient handling
3. **Phase 3 (Hooks)** - Create hooks with real-time calculations
4. **Phase 4 (Components)** - Build core components (Card, Form, Table)
5. **Phase 5 (Management)** - Create management sections
6. **Phase 6 (Pages)** - Integrate into app pages
7. **Phase 7 (Advanced)** - Add export and optimizations

## Next Steps

1. **Review this plan** and confirm all decisions align with your vision
2. **Approve the technical approach** for mixed ingredients and cost calculations
3. **Confirm the UI specifications** for cost analysis display
4. **Begin implementation** starting with Phase 2 (Utilities) due to complex calculation requirements

Once approved, implementation will follow the established patterns from recipes and inventory sections, with enhanced support for mixed ingredient types and profitability analysis.
