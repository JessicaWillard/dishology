import { tv } from "tailwind-variants";

export const recipeCardStyles = tv({
  base: "flex flex-col gap-6 border-gray-light border cursor-pointer transition-all duration-300",
});

export const recipeCardHeaderStyles = tv({
  base: "flex items-center justify-between gap-8",
});

export const recipeCardMetricStyles = tv({
  base: "flex flex-col gap-2",
});

export const recipeCardTotalStyles = tv({
  base: "flex flex-col gap-xs rounded-md px-3 py-2 bg-gray-dark text-white",
});

// Recipe Ingredients Table Styles
export const recipeIngredientsTableStyles = tv({
  base: "w-full border-collapse border border-gray-light rounded-lg overflow-hidden",
});

export const recipeIngredientsTableHeaderStyles = tv({
  base: "px-4 py-3 text-left text-xs font-medium text-white bg-gray-dark",
});

export const recipeIngredientsTableRowStyles = tv({
  base: "border-b hover:bg-gray-50 transition-colors duration-200 relative",
  variants: {
    variant: {
      default: "bg-white border-gray-light",
      produce: "bg-produce-light text-produce border-produce",
      dry: "bg-dry-light text-dry border-dry",
      meat: "bg-meat-light text-meat border-meat",
      dairy: "bg-dairy-light text-dairy border-dairy",
      beverage: "bg-beverage-light text-beverage border-beverage",
      cleaning: "bg-cleaning-light text-cleaning border-cleaning",
      smallwares: "bg-smallwares-light text-smallwares border-smallwares",
      equipment: "bg-equipment-light text-equipment border-equipment",
      other: "bg-other-light text-other border-other",
    },
    clickable: {
      true: "cursor-pointer",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    clickable: false,
  },
});

export const recipeIngredientsTableCellStyles = tv({
  base: "px-4 py-3 text-sm",
  variants: {
    width: {
      name: "w-10/12",
      quantity: "w-1/12",
      total: "w-1/12",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    align: "left",
  },
});

export const recipeFormStyles = tv({
  base: "flex flex-col gap-6",
});

export const recipeFormSectionStyles = tv({
  base: "flex flex-col gap-4",
});

export const recipeFormRowStyles = tv({
  base: "grid gap-4",
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    },
  },
});

export const recipeIngredientsFormStyles = tv({
  base: "flex flex-col gap-4 p-4 border border-gray-light rounded-lg bg-gray-50",
});

export const recipeIngredientRowStyles = tv({
  base: "flex gap-2 items-end justify-between p-3 border rounded-lg",
});
