import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";

const boxStyles = tv(
  {
    variants: {
      position: {
        static: "static",
        fixed: "fixed",
        absolute: "absolute",
        relative: "relative",
        sticky: "sticky",
      },
      padding: {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
      gap: {
        none: "gap-0",
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
      display: {
        none: "hidden",
        block: "block",
        grid: "grid",
        flexCol: "flex flex-col",
        flexRow: "flex flex-row",
      },
      align: {
        start: "items-start",
        center: "items-center",
        right: "items-end",
        end: "items-end",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      gridCols: {
        none: "grid-cols-none",
        auto: "grid-cols-auto",
        autoFit: "grid-cols-auto-fit",
        autoFill: "grid-cols-auto-fill",
      },
      width: {
        full: "w-full",
        auto: "w-auto",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-lg",
      },
      defaultVariants: {
        position: "relative",
        padding: "md",
      },
    },
  },
  { twMerge: true }
);

export type BoxProps = HTMLAttributes<HTMLDivElement> &
  Omit<VariantProps<typeof boxStyles>, "gridCols" | "gap"> & {
    gridCols?: string | number;
    gap?: string | number;
  };

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      position,
      padding,
      radius,
      shadow,
      gap,
      display,
      align,
      justify,
      width,
      gridCols,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          boxStyles({
            padding,
            radius,
            shadow,
            display,
            align,
            justify,
            width,
            position,
          }),
          display === "grid" &&
            gridCols &&
            (typeof gridCols === "number"
              ? `grid-cols-${gridCols}`
              : boxStyles({
                  gridCols: gridCols as
                    | "none"
                    | "auto"
                    | "autoFit"
                    | "autoFill",
                })),
          gap &&
            (typeof gap === "number"
              ? `gap-${gap}`
              : boxStyles({ gap: gap as "none" | "sm" | "md" | "lg" | "xl" })),
          className
        )}
        {...rest}
      />
    );
  }
);

Box.displayName = "Box";

export { boxStyles };
