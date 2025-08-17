import React, { forwardRef, type CSSProperties } from "react";
import * as Icons from "../icons";
import type { IconProps } from "./interface";
export type { IconProps } from "./interface";
export type IconName = keyof typeof Icons;

export const Icon = forwardRef<
  SVGSVGElement,
  IconProps & { style?: CSSProperties }
>(({ name, className, style, decorative = true, label, ...svgProps }, ref) => {
  // Ensure name is a string for lookup
  const iconName = String(name);

  const SelectedIcon = (
    Icons as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
  )[iconName] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  // Handle case where icon is not found
  if (!SelectedIcon) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }

  // Accessibility: hide if decorative and no label
  const ariaHidden = decorative && !label ? true : undefined;
  const role = label ? "img" : undefined;

  return (
    <SelectedIcon
      ref={ref}
      aria-hidden={ariaHidden}
      aria-label={label}
      role={role}
      className={className}
      style={style}
      {...svgProps}
    />
  );
});

Icon.displayName = "Icon";

export default Icon;
