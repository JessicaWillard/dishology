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
