import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import type { JSX } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";

const textStyles = tv(
  {
    variants: {
      variant: {
        body: "leading-normal",
        muted: "text-foreground/70",
        danger: "!text-error",
        success: "text-primary",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
        fit: "w-fit",
        max: "w-max",
      },
    },
    defaultVariants: {
      variant: "body",
      size: "sm",
      align: "left",
      weight: "normal",
      width: "auto",
    },
    compoundVariants: [
      {
        size: "md",
        weight: "medium",
      },
      {
        size: "lg",
        weight: "bold",
      },
      {
        size: "xl",
        weight: "extrabold",
      },
      {
        size: "2xl",
        weight: "extrabold",
      },
    ],
  },
  { twMerge: false }
);

export type TextProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textStyles> & {
    as?: keyof JSX.IntrinsicElements;
  };

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    { as = "p", className, variant, size, align, weight, width, ...rest },
    ref
  ) => {
    const Comp = as as ElementType;
    return (
      <Comp
        ref={ref}
        className={clsx(
          textStyles({ variant, size, align, weight, width }),
          className
        )}
        {...rest}
      />
    );
  }
);

Text.displayName = "Text";

export { textStyles };
