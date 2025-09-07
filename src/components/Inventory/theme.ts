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
  base: "text-white font-bold text-sm px-1 py-3 md:px-4 md:text-sm text-left",
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
  base: "border-b hover:bg-gray-50 transition-colors relative",
  variants: {
    variant: {
      default: "bg-white border-gray-light",
      produce: "bg-produce-light border-produce",
      dry: "bg-dry-light border-dry",
      meat: "bg-meat-light border-meat",
      dairy: "bg-dairy-light border-dairy",
      beverage: "bg-beverage-light border-beverage",
      cleaning: "bg-cleaning-light border-cleaning",
      smallwares: "bg-smallwares-light border-smallwares",
      equipment: "bg-equipment-light border-equipment",
      other: "bg-other-light border-other",
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
  base: "text-xs py-4 px-1 md:px-4 md:text-sm",
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
    width: {
      date: "w-20 md:w-auto",
      quantity: "w-12 md:w-auto",
      name: "w-25 md:w-[35%]",
      auto: "w-auto",
    },
  },
  defaultVariants: {
    variant: "default",
    align: "left",
    width: "auto",
  },
});

export const inventoryTableQuantityStyles = tv({
  base: "py-1 px-2 rounded-lg text-white text-xs font-medium",
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
  base: "text-error absolute -right-4 lg:right-0 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-6 lg:h-6",
});
