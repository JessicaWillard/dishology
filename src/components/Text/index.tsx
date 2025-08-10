import { forwardRef, type HTMLAttributes } from "react";
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
        danger: "text-red-600",
        success: "text-green-600",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        h1: "text-4xl font-bold",
        h2: "text-3xl font-semibold",
        h3: "text-2xl font-semibold",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "body",
      size: "md",
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
    const Comp = as as any;
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
