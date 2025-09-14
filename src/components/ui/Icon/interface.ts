import type React from "react";
export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> {
  name: IconName | string;
  className?: string;
  decorative?: boolean;
  label?: string;
}

// This will be overridden by the actual IconName type from the implementation
export type IconName =
  | "ArrowLeft"
  | "ArrowRight"
  | "Check"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronDown"
  | "CloseBtn"
  | "Plus"
  | "Search"
  | "Dashboard"
  | "Ingredient"
  | "Recipe"
  | "Dish"
  | "Calendar"
  | "Download"
  | "Filter"
  | "Currency"
  | "LowStock"
  | "Minimize"
  | "Maximize"
  | "Grid"
  | "List"
  | "Warning"
  | "Reset";
