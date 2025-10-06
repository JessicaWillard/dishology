import { tv } from "tailwind-variants";

// Main dish card styles
export const dishCardStyles = tv({
  base: "flex flex-col gap-4 border border-gray-light bg-white rounded-lg p-4 transition-all",
  variants: {
    expanded: {
      true: "shadow-lg",
      false: "shadow-md hover:shadow-lg",
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

// Cost analysis section styles
export const costAnalysisStyles = tv({
  base: "bg-gray-50 p-4 rounded-lg border border-gray-light",
});

export const costAnalysisRowStyles = tv({
  base: "flex justify-between items-center py-2",
  variants: {
    variant: {
      default: "",
      highlight: "font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Profit/margin display styles
// export const profitStyles = tv({
//   base: "font-bold text-lg",
//   variants: {
//     variant: {
//       positive: "text-green-600",
//       negative: "text-red-600",
//       neutral: "text-gray-600",
//     },
//   },
//   defaultVariants: {
//     variant: "neutral",
//   },
// });

// export const marginBadgeStyles = tv({
//   base: "px-3 py-1 rounded-md font-bold text-sm",
//   variants: {
//     variant: {
//       positive: "bg-green-100 text-green-700",
//       negative: "bg-red-100 text-red-700",
//       neutral: "bg-gray-100 text-gray-700",
//     },
//   },
//   defaultVariants: {
//     variant: "neutral",
//   },
// });

export const metricItemStyles = tv({
  base: "flex flex-col gap-1",
  variants: {
    variant: {
      default: "",
      highlighted: "px-3 py-2 rounded-md text-white",
    },
    profitVariant: {
      positive: "",
      negative: "",
      neutral: "",
    },
  },
  compoundVariants: [
    {
      variant: "highlighted",
      profitVariant: "positive",
      class: "bg-primary",
    },
    {
      variant: "highlighted",
      profitVariant: "negative",
      class: "bg-error",
    },
    {
      variant: "highlighted",
      profitVariant: "neutral",
      class: "bg-gray-dark",
    },
  ],
  defaultVariants: {
    variant: "default",
    profitVariant: "neutral",
  },
});

// Dish ingredients table styles (matching recipe table structure)
export const dishTableStyles = tv({
  base: "w-full border-collapse border border-gray-light rounded-lg overflow-hidden",
});

export const dishTableHeaderStyles = tv({
  base: "px-4 py-3 text-left text-xs font-medium text-white bg-gray-dark",
});

export const dishTableRowStyles = tv({
  base: "border-b hover:bg-gray-50 transition-colors duration-200 relative",
  variants: {
    type: {
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
      recipe: "bg-white border-gray-dark",
    },
    clickable: {
      true: "cursor-pointer",
      false: "",
    },
  },
  defaultVariants: {
    type: "default",
    clickable: false,
  },
});

export const dishTableCellStyles = tv({
  base: "px-4 py-3 text-sm",
  variants: {
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

// Form ingredient row styles
export const ingredientRowStyles = tv({
  base: "flex gap-2 items-start p-3 border rounded-lg",
  variants: {
    type: {
      produce: "bg-produce-light border-produce",
      dry: "bg-dry-light border-dry",
      meat: "bg-meat-light border-meat",
      dairy: "bg-dairy-light border-dairy",
      beverage: "bg-beverage-light border-beverage",
      other: "bg-other-light border-other",
      recipe: "bg-gray-50 border-gray-400",
      default: "bg-white border-gray-light",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

// Low stock indicator for inventory items in dish ingredients
export const lowStockIndicatorStyles = tv({
  base: "bg-error text-white px-2 py-1 rounded text-xs font-bold",
});
