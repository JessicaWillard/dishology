import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";

const boxStyles = tv(
  {
    base: "relative",
    variants: {
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
        block: "block",
        flexCol: "flex flex-col",
        flexRow: "flex flex-row",
      },
      align: {
        start: "items-start",
        center: "items-center",
        right: "items-end",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      // border: {
      //   false: "border-none",
      //   true: "border",
      // },
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
    },
    defaultVariants: {
      tone: "default",
      padding: "none",
      radius: "md",
      shadow: "none",
      gap: "none",
      display: "block",
      width: "auto",
    },
  },
  { twMerge: false }
);

export type BoxProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof boxStyles>;

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      padding,
      radius,
      shadow,
      gap,
      display,
      align,
      justify,
      width,
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
            gap,
            display,
            align,
            justify,
            width,
          }),
          className
        )}
        {...rest}
      />
    );
  }
);

Box.displayName = "Box";

export { boxStyles };
