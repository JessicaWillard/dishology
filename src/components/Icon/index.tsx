import React, { forwardRef, type CSSProperties } from "react";
import * as Icons from "../icons";
import type { IconProps } from "./interface";
import { SIZE_MAP } from "./interface";
export type { IconProps } from "./interface";
export type IconName = keyof typeof Icons;

export const Icon = forwardRef<
  SVGSVGElement,
  IconProps & { style?: CSSProperties }
>(
  (
    {
      name,
      size = "md",
      className,
      style,
      decorative = true,
      label,
      ...svgProps
    },
    ref
  ) => {
    const SelectedIcon = (
      Icons as Record<
        string,
        React.ComponentType<React.SVGProps<SVGSVGElement>>
      >
    )[name] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

    const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] ?? 20;

    // Accessibility: hide if decorative and no label
    const ariaHidden = decorative && !label ? true : undefined;
    const role = label ? "img" : undefined;

    return (
      <SelectedIcon
        ref={ref}
        width={pixelSize}
        height={pixelSize}
        aria-hidden={ariaHidden}
        aria-label={label}
        role={role}
        className={className}
        style={style}
        {...svgProps}
      />
    );
  }
);

Icon.displayName = "Icon";

export default Icon;
