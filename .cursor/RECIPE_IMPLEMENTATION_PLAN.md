# Recipe Section Implementation Plan

## Overview

This document outlines the complete implementation plan for the recipe section of the Dishology application. The implementation follows the same patterns established by the inventory section while adapting to recipe-specific requirements.

## Current State Analysis

### ✅ What Exists

- **Database Tables**: `recipes`, `recipe_ingredients` (junction table)
- **TypeScript Types**: `Recipe`, `RecipeIngredient`, `RecipeWithIngredients`, `RecipeFormData`
- **Navigation**: Recipe icon and route placeholder in NavBar
- **Component Structure**: Empty `recipes-components/` folder
- **Database Schema**: Complete with proper relationships

### ❌ What's Missing

- API routes for recipes and recipe ingredients
- React Query hooks for data management
- All UI components (cards, forms, tables)
- Pages and client components
- Validation schemas
- Cost calculation logic

## Component Specifications

### RecipeCard Component

**Two States: Collapsed (default) and Expanded**

#### Collapsed State

- **Header**:
  - Recipe name (large, bold text)
  - Description (smaller, gray text)
  - Toggle button (top right, expand/collapse icon)
- **Key Metrics Row**:
  - Batch size (e.g., "5 L")
  - Units (e.g., "30" - calculated from batch size)
  - Prep time (e.g., "1h")
  - Cost per unit (e.g., "$1.50")
  - Total cost (highlighted in dark box, e.g., "$45.00")
- **Footer**:
  - Edit button (bottom left, green text)

#### Expanded State

- **All collapsed content plus**:
- **Instructions Section**:
  - Title: "Instructions"
  - Numbered list of steps
- **Ingredients Table**:
  - Simplified version of InventoryTable
  - Columns: Item, Qty, Total
  - Shows low stock indicators
  - Displays ingredient costs

### RecipeIngredientsTable Component

**Simplified Inventory Table for Recipe Ingredients**

- **Columns**:
  - Item name (from inventory)
  - Quantity needed (for recipe)
  - Total cost (quantity × inventory price)
- **Features**:
  - Low stock indicators
  - Cost calculations
  - Responsive design
- **Data Source**: Recipe ingredients with joined inventory data

## Implementation Phases

### Phase 1: API Layer (Foundation)

#### Files to Create

1. `src/app/api/recipes/route.ts`

   - `GET /api/recipes` - List all recipes with ingredients
   - `POST /api/recipes` - Create new recipe with ingredients

2. `src/app/api/recipes/[id]/route.ts`

   - `GET /api/recipes/[id]` - Get single recipe with ingredients
   - `PUT /api/recipes/[id]` - Update recipe and ingredients
   - `DELETE /api/recipes/[id]` - Delete recipe and ingredients

3. `src/utils/api/recipes.ts`

   - Client API utilities
   - Error handling
   - Type-safe API calls

4. `src/utils/validation/recipe.ts`
   - Recipe form validation
   - Ingredient validation
   - Cost calculation validation

#### Key API Considerations

- **Cost Calculations**: Compute total recipe cost from ingredient quantities and inventory prices
- **Batch Size Logic**: Handle batch size vs units calculation (e.g., 1L batch = 10 units of 100ml)
- **Ingredient Filtering**: Only include inventory items with types: `produce`, `dry`, `meat`, `dairy`, `beverage`
- **Data Joins**: Efficiently fetch recipes with ingredients and inventory data

### Phase 2: Data Management

#### Files to Create

1. `src/hooks/useRecipesQuery.ts`

   - React Query hooks for CRUD operations
   - Optimistic updates
   - Cache management

2. `src/hooks/useRecipeForm.ts`
   - Form state management
   - Validation handling
   - Persistence (localStorage)

#### Key Features

- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Cost Recalculation**: Automatic cost updates when ingredients change
- **Form Persistence**: Save form data to localStorage
- **Validation**: Real-time field validation

### Phase 3: Core Components

#### Files to Create

1. `src/components/recipes-components/RecipeCard/`

   - `index.tsx` - Main card component
   - `interface.ts` - Props interface
   - `recipeCard.stories.tsx` - Storybook stories

2. `src/components/recipes-components/RecipeIngredientsTable/`

   - `index.tsx` - Ingredients table component
   - `interface.ts` - Props interface

3. `src/components/recipes-components/RecipeForm/`

   - `index.tsx` - Form component
   - `interface.ts` - Props interface

4. `src/components/recipes-components/theme.ts`
   - Styling and variants

#### Component Architecture

- **Co-located Interfaces**: All props in `interface.ts` files
- **Tailwind Variants**: Consistent styling patterns
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive Design**: Mobile-first approach

### Phase 4: Management Components

#### Files to Create

1. `src/components/recipes-components/CreateRecipeSection/`

   - `index.tsx` - Create recipe panel
   - `interface.ts` - Props interface

2. `src/components/recipes-components/EditRecipeSection/`

   - `index.tsx` - Edit recipe panel
   - `interface.ts` - Props interface

3. `src/components/recipes-components/RecipesList/`

   - `index.tsx` - Recipe list component
   - `interface.ts` - Props interface

4. `src/components/recipes-components/index.ts`
   - Barrel exports

#### Key Features

- **Card-Only Display**: No table view, only RecipeCard components
- **Alphabetical Sorting**: Recipes sorted by name A-Z
- **Side Panels**: Consistent with inventory implementation
- **Form Management**: Reusable form components
- **Error Handling**: User-friendly error messages
- **Loading States**: Proper loading indicators

### Phase 5: Pages and Integration

#### Files to Create

1. `src/app/recipes/page.tsx`

   - Server component with authentication
   - Redirect logic for unauthorized users

2. `src/app/recipes/client.tsx`
   - Client component with state management
   - Card-only display (no view switching)
   - Search functionality
   - Alphabetical sorting

#### Integration Points

- **Navigation**: Update NavBar to include recipes route
- **Routing**: Proper Next.js 13+ app router integration
- **Authentication**: Clerk integration for user management

### Phase 6: Advanced Features

#### Files to Create

1. `src/utils/recipeCalculations.ts`

   - Cost calculation utilities
   - Unit conversion logic
   - Batch size calculations

2. Export functionality
   - CSV export for recipes
   - Recipe cost reports

## Technical Specifications

### Cost Calculation Strategy

```typescript
// Recipe cost = sum of (ingredient_quantity * inventory_price_per_unit)
const calculateRecipeCost = (ingredients: RecipeIngredientWithInventory[]) => {
  return ingredients.reduce((total, ingredient) => {
    const inventoryPrice = parseFloat(ingredient.inventory.price_per_unit);
    const quantity = ingredient.quantity;
    return total + inventoryPrice * quantity;
  }, 0);
};

// Cost per unit = total_recipe_cost / units_in_batch
const calculateCostPerUnit = (totalCost: number, units: number) => {
  return units > 0 ? totalCost / units : 0;
};
```

### Units vs Batch Size Logic

```typescript
// If batch_size = 1L and unit_size = 100ml, then units = 10
const calculateUnits = (batchSize: number, unitSize: number) => {
  return Math.floor(batchSize / unitSize);
};

// Example: 1L batch with 100ml units = 10 units
const units = calculateUnits(1, 0.1); // Returns 10
```

### Ingredient Filtering

```typescript
// Only show inventory items for recipe ingredients
const ALLOWED_INVENTORY_TYPES = [
  "produce",
  "dry",
  "meat",
  "dairy",
  "beverage",
  "other",
] as const;

// Exclude cleaning, smallwares, equipment
const EXCLUDED_INVENTORY_TYPES = [
  "cleaning",
  "smallwares",
  "equipment",
] as const;
```

### Database Queries

```sql
-- Get recipe with ingredients and inventory data
SELECT
  r.*,
  ri.quantity as ingredient_quantity,
  ri.unit as ingredient_unit,
  i.name as inventory_name,
  i.price_per_unit,
  i.type as inventory_type
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
LEFT JOIN inventory i ON ri.inventory_id = i.id
WHERE r.user_id = $1
ORDER BY r.name ASC; -- Alphabetical sorting
```

## Questions for Clarification

### 1. Cost Calculation

**Decision**: Cost per unit will be calculated as `total_recipe_cost / units_in_batch` for consistency with the UI mockup.

### 2. Ingredient Quantity Units

**Decision**: Recipe ingredients will use the same units as inventory items for simplicity.

### 3. Instructions Formatting

**Decision**: Instructions will use plain text with numbered lists for simplicity, with rich text support to be added later.

### 4. Recipe Categories

**Decision**: Keep simple for now with no categories. Categories can be added in a future Phase 2.

### 5. Batch Size Validation

**Decision**: Only warn if batch size is smaller than unit size. Decimals are allowed for batch sizes (e.g., 1.5 kg, 2.5 lbs) and units calculation can result in decimals.

### 6. Ingredient Selection Interface

**Decision**: Use searchable dropdown (ComboBox) for ingredient selection in forms.

## File Structure

```
src/
├── app/
│   └── recipes/
│       ├── page.tsx
│       └── client.tsx
├── components/
│   └── recipes-components/
│       ├── RecipeCard/
│       │   ├── index.tsx
│       │   ├── interface.ts
│       │   └── recipeCard.stories.tsx
│       ├── RecipeIngredientsTable/
│       │   ├── index.tsx
│       │   └── interface.ts
│       ├── RecipeForm/
│       │   ├── index.tsx
│       │   └── interface.ts
│       ├── CreateRecipeSection/
│       │   ├── index.tsx
│       │   └── interface.ts
│       ├── EditRecipeSection/
│       │   ├── index.tsx
│       │   └── interface.ts
│       ├── RecipesList/
│       │   ├── index.tsx
│       │   └── interface.ts
│       ├── theme.ts
│       └── index.ts
├── hooks/
│   ├── useRecipesQuery.ts
│   └── useRecipeForm.ts
├── utils/
│   ├── api/
│   │   └── recipes.ts
│   ├── validation/
│   │   └── recipe.ts
│   └── recipeCalculations.ts
└── app/
    └── api/
        └── recipes/
            ├── route.ts
            └── [id]/
                └── route.ts
```

## Success Criteria

### Phase 1 Complete

- [ ] API routes handle all CRUD operations
- [ ] Cost calculations work correctly
- [ ] Database queries are optimized
- [ ] Error handling is comprehensive

### Phase 2 Complete

- [ ] React Query hooks provide optimistic updates
- [ ] Form management handles validation
- [ ] Data persistence works correctly
- [ ] Cache invalidation is proper

### Phase 3 Complete

- [ ] RecipeCard displays correctly in both states
- [ ] RecipeIngredientsTable shows proper data
- [ ] RecipeForm handles all input types
- [ ] Components are accessible and responsive

### Phase 4 Complete

- [ ] Create/Edit panels work seamlessly
- [ ] RecipesList displays data correctly
- [ ] All components integrate properly
- [ ] Error states are handled gracefully

### Phase 5 Complete

- [ ] Recipe page loads and functions correctly
- [ ] Recipes display as cards only (no table view)
- [ ] Recipes are sorted alphabetically by name
- [ ] Navigation integration works
- [ ] Authentication is properly handled
- [ ] Mobile experience is smooth

### Phase 6 Complete

- [ ] Export functionality is implemented
- [ ] Performance is optimized
- [ ] All edge cases are handled

## Lessons Learned & Critical Patterns

### Form Persistence with localStorage (CRITICAL)

**Issue Discovered**: Form data persistence can cause cross-contamination between Create and Edit modes if not properly isolated.

#### The Problem

When implementing form hooks with localStorage persistence, using a single `formId` (or the default value) for both Create and Edit modes causes:

1. Abandoned create form data to persist in localStorage
2. Edit forms loading the wrong data from localStorage
3. User confusion when editing existing items shows values from abandoned create attempts

#### The Solution Pattern

**ALWAYS** use unique `formId` values for Create vs Edit modes:

```typescript
// ✅ CORRECT - Unique formIds for each mode
const { formData, ...formMethods } = useFormHook({
  initialData,
  formId:
    mode === "edit" && initialData?.id ? `edit-${initialData.id}` : "create",
});
```

```typescript
// ❌ INCORRECT - Uses default formId for both modes
const { formData, ...formMethods } = useFormHook({
  initialData,
  // No formId specified - both modes share the same localStorage key
});
```

#### Implementation Details

**In Form Components** (`RecipeForm`, `InventoryForm`, etc.):

```typescript
// Example from RecipeForm/index.tsx (lines 173-174)
useRecipeForm({
  initialData: initialData
    ? {
        /* ... */
      }
    : undefined,
  initialIngredients: initialData?.ingredients || [],
  formId:
    mode === "edit" && initialData?.id ? `edit-${initialData.id}` : "create",
});
```

**localStorage Keys Generated**:

- Create mode: `recipe_form_create` (shared across all new recipes)
- Edit mode: `recipe_form_edit-abc123` (unique per recipe ID)

#### Reference Implementation

See working example in:

- `src/components/inventory-components/InventoryForm/index.tsx` (lines 89-90)
- `src/components/recipes-components/RecipeForm/index.tsx` (lines 173-174)

#### When to Apply This Pattern

Apply this pattern to **ALL** form hooks that:

1. Use localStorage for persistence (`enablePersistence = true`)
2. Support both Create and Edit modes
3. Accept an optional `formId` parameter

This includes:

- `useRecipeForm`
- `useInventoryForm`
- `useSupplierForm`
- Any future form hooks following this pattern

#### Testing Checklist

When implementing a new form with persistence:

- [ ] Start creating a new item
- [ ] Fill in some fields but don't save
- [ ] Close the create panel
- [ ] Open an existing item for editing
- [ ] Verify the edit form shows the CORRECT item data, not the abandoned create data

## Next Steps

1. **Review this plan** and provide feedback on the questions above
2. **Confirm technical decisions** for cost calculations and unit handling
3. **Approve the file structure** and component architecture
4. **Begin implementation** starting with Phase 1 (API Layer)

Once you've reviewed this plan and provided clarifications, I'll proceed with the implementation following the established patterns from the inventory section.
