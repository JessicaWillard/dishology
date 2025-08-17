import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import type { JSX } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";

const textStyles = tv(
  {
    base: "text-foreground",
    variants: {
      variant: {
        body: "leading-relaxed",
        muted: "text-foreground/70",
        danger: "!text-error",
        success: "text-primary",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base font-medium",
        lg: "text-lg font-bold",
        xl: "text-xl font-extrabold",
        "2xl": "text-2xl font-extrabold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "body",
      size: "sm",
      align: "left",
    },
  },
  { twMerge: false }
);

export type TextProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textStyles> & {
    as?: keyof JSX.IntrinsicElements;
  };

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as = "p", className, variant, size, align, ...rest }, ref) => {
    const Comp = as as ElementType;
    return (
      <Comp
        ref={ref}
        className={clsx(textStyles({ variant, size, align }), className)}
        {...rest}
      />
    );
  }
);

Text.displayName = "Text";

export { textStyles };
