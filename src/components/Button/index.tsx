"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";

const buttonStyles = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      solid: "bg-foreground text-background hover:opacity-90",
      outline:
        "border border-foreground/20 text-foreground hover:bg-foreground/5",
      ghost: "text-foreground hover:bg-foreground/10",
      link: "text-foreground underline-offset-4 hover:underline p-0 h-auto",
    },
    size: {
      xs: "h-8 px-2 py-1 text-xs",
      sm: "h-9 px-3",
      md: "h-10 px-4",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10 p-0",
    },
    radius: {
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
    radius: "md",
  },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(buttonStyles({ variant, size, radius }), className)}
        {...rest}
      >
        {leftIcon ? <span className="mr-2 inline-flex">{leftIcon}</span> : null}
        <span>{isLoading ? "Loading…" : children}</span>
        {rightIcon ? (
          <span className="ml-2 inline-flex">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonStyles };
