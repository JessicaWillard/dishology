"use client";

import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import { clsx } from "clsx";
import type { ButtonProps } from "./interface";

const buttonStyles = tv(
  {
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
  },
  { twMerge: false }
);

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    className,
    variant,
    size,
    radius,
    isLoading,
    leftIcon,
    rightIcon,
    children,
    handlePress,
    ...rest
  } = props as ButtonProps;

  const content = (
    <>
      {leftIcon ? <span className="mr-2 inline-flex">{leftIcon}</span> : null}
      <span>{isLoading ? "Loading…" : children}</span>
      {rightIcon ? <span className="ml-2 inline-flex">{rightIcon}</span> : null}
    </>
  );

  const classes = clsx(buttonStyles({ variant, size, radius }), className);

  if ("href" in props && props.href) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        onClick={
          handlePress as
            | ((e: React.MouseEvent<HTMLAnchorElement>) => void)
            | undefined
        }
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      onClick={
        handlePress as
          | ((e: React.MouseEvent<HTMLButtonElement>) => void)
          | undefined
      }
      disabled={
        ("disabled" in props && !!props.disabled) ||
        ("isDisabled" in props && !!props.isDisabled)
      }
      {...buttonProps}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

export { buttonStyles };
