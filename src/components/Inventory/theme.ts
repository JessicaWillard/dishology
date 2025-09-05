import { tv } from "tailwind-variants";

export const inventoryStyles = tv({
  base: "flex flex-col gap-4 border",
  variants: {
    variant: {
      default: "border-gray-light bg-white",
      produce: "border-produce !bg-produce-light",
      dry: "border-dry bg-dry-light",
      meat: "border-meat bg-meat-light",
      dairy: "border-dairy bg-dairy-light",
      beverage: "border-beverage bg-beverage-light",
      cleaning: "border-cleaning bg-cleaning-light",
      smallwares: "border-smallwares bg-smallwares-light",
      equipment: "border-equipment bg-equipment-light",
      other: "border-other bg-other-light",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const inventoryTextStyles = tv({
  variants: {
    variant: {
      default: "text-black",
      produce: "text-produce",
      dry: "text-dry",
      meat: "text-meat",
      dairy: "text-dairy",
      beverage: "text-beverage",
      cleaning: "text-cleaning",
      smallwares: "text-smallwares",
      equipment: "text-equipment",
      other: "text-other",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const inventoryHighlightStyles = tv({
  base: "text-white",
  variants: {
    variant: {
      default: "bg-gray-dark",
      produce: "bg-produce",
      dry: "bg-dry",
      meat: "bg-meat",
      dairy: "bg-dairy",
      beverage: "bg-beverage",
      cleaning: "bg-cleaning",
      smallwares: "bg-smallwares",
      equipment: "bg-equipment",
      other: "bg-other",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const inventoryCardContainerStyles = tv({
  base: "flex flex-col gap-4",
});

export const inventoryCardWrapperStyles = tv({
  base: "flex items-center justify-between gap-8 w-auto",
});

export const inventoryCardLowInventoryStyles = tv({
  base: "bg-error text-white",
});

// Table-specific styles
export const inventoryTableStyles = tv({
  base: "w-full border-collapse border-b-2",
  variants: {
    variant: {
      default: "border-gray-light",
      produce: "border-produce",
      dry: "border-dry",
      meat: "border-meat",
      dairy: "border-dairy",
      beverage: "border-beverage",
      cleaning: "border-cleaning",
      smallwares: "border-smallwares",
      equipment: "border-equipment",
      other: "border-other",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const inventoryTableHeaderStyles = tv({
  base: "text-white font-bold text-sm px-4 py-3 text-left",
});

export const inventoryTHeaderRowStyles = tv({
  base: "rounded-t-md",
  variants: {
    variant: {
      default: "bg-gray-dark",
      produce: "bg-produce",
      dry: "bg-dry",
      meat: "bg-meat",
      dairy: "bg-dairy",
      beverage: "bg-beverage",
      cleaning: "bg-cleaning",
      smallwares: "bg-smallwares",
      equipment: "bg-equipment",
      other: "bg-other",
    },
  },
});

export const inventoryTableRowStyles = tv({
  base: "border-b border-gray-light hover:bg-gray-50 transition-colors relative",
  variants: {
    variant: {
      default: "bg-white",
      produce: "bg-produce-light",
      dry: "bg-dry-light",
      meat: "bg-meat-light",
      dairy: "bg-dairy-light",
      beverage: "bg-beverage-light",
      cleaning: "bg-cleaning-light",
      smallwares: "bg-smallwares-light",
      equipment: "bg-equipment-light",
      other: "bg-other-light",
    },
    clickable: {
      true: "cursor-pointer",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    compact: false,
    clickable: false,
  },
});

export const inventoryTableCellStyles = tv({
  base: "px-4 py-2 text-sm",
  variants: {
    variant: {
      default: "text-black",
      produce: "text-produce",
      dry: "text-dry",
      meat: "text-meat",
      dairy: "text-dairy",
      beverage: "text-beverage",
      cleaning: "text-cleaning",
      smallwares: "text-smallwares",
      equipment: "text-equipment",
      other: "text-other",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "default",
    align: "left",
  },
});

export const inventoryTableQuantityStyles = tv({
  base: "p-1 rounded-lg text-white text-xs font-medium",
  variants: {
    variant: {
      default: "bg-gray-dark",
      produce: "bg-produce",
      dry: "bg-dry",
      meat: "bg-meat",
      dairy: "bg-dairy",
      beverage: "bg-beverage",
      cleaning: "bg-cleaning",
      smallwares: "bg-smallwares",
      equipment: "bg-equipment",
      other: "bg-other",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const inventoryTableQuantityLowStyles = tv({
  base: "text-error absolute right-4 top-1/2 -translate-y-1/2",
});
