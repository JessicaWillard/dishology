import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";

const boxStyles = tv({
  base: "relative w-full bg-white text-foreground border border-foreground/10",
  variants: {
    tone: {
      default: "bg-white",
      muted: "bg-foreground/5",
      contrast: "bg-foreground text-background",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
    radius: {
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
    padding: "md",
    radius: "md",
    shadow: "sm",
  },
});

export type BoxProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof boxStyles>;

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, tone, padding, radius, shadow, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(boxStyles({ tone, padding, radius, shadow }), className)}
        {...rest}
      />
    );
  },
);

Box.displayName = "Box";

export { boxStyles };


