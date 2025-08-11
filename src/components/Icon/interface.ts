import type React from "react";

export const SIZE_MAP = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof SIZE_MAP | number;

export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> {
  name: IconName;
  size?: IconSize;
  className?: string;
  decorative?: boolean;
  label?: string;
}

// IconName is dependent on the icon exports. Declared in implementation via `keyof typeof Icons` and re-exported here.
export type IconName = string;
