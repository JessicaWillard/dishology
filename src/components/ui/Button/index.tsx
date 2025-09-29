/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";
import type { ButtonProps } from "./interface";
import { Icon } from "../Icon";

const buttonStyles = tv(
  {
    base: "inline-flex items-center justify-center whitespace-nowrap text-base font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    variants: {
      variant: {
        solid:
          "bg-primary text-white hover:bg-black rounded-xl min-h-[44px] min-w-[44px] px-6 py-2",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl min-h-[44px] min-w-[44px] px-6 py-2",
        ghost:
          "text-primary hover:text-black min-w-0 min-h-0 px-0 rounded-none",
        destructive:
          "text-error hover:text-black min-w-0 min-h-0 px-0 rounded-none",
        tag: "bg-gray-dark text-white hover:bg-gray-dark/80 px-2 py-1 text-xs min-h-auto min-w-auto rounded-md [&_svg]:h-4 [&_svg]:w-4",
        nav: "text-primary hover:text-black active:text-black text-xs min-w-0 min-h-0 px-0 py-0 rounded-none",
      },
      iconOnly: {
        true: "px-0",
      },
    },
    defaultVariants: {
      variant: "solid",
      iconOnly: false,
    },
  },
  { twMerge: true }
);

export type ButtonVariantProps = VariantProps<typeof buttonStyles>;

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps & ButtonVariantProps
>((props, ref) => {
  const {
    className,
    variant,
    isLoading,
    leftIcon,
    rightIcon,
    children,
    iconOnly = false,
    handlePress,
    ...rest
  } = props;

  const content = (
    <>
      {leftIcon ? (
        <span className="mr-2 inline-flex">
          <Icon name={leftIcon} />
        </span>
      ) : null}
      <span>{isLoading ? "Loading…" : children}</span>
      {rightIcon ? (
        <span className="ml-2 inline-flex">
          <Icon name={rightIcon} />
        </span>
      ) : null}
    </>
  );

  const classes = clsx(buttonStyles({ variant, iconOnly }), className);

  if ("href" in props && props.href) {
    type ExtendedAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      linkBehavior?: unknown;
      isDisabled?: boolean;
    };
    const {
      linkBehavior: _,
      isDisabled: __,
      ...anchorProps
    } = rest as ExtendedAnchorProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        onClick={
          handlePress
            ? (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                (
                  handlePress as (
                    e: React.MouseEvent<HTMLAnchorElement>
                  ) => void
                )(e);
              }
            : undefined
        }
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  type ExtendedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    linkBehavior?: unknown;
    isDisabled?: boolean;
  };
  const {
    linkBehavior: _,
    isDisabled: __,
    ...buttonProps
  } = rest as ExtendedButtonProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      onClick={handlePress as React.MouseEventHandler<HTMLButtonElement>}
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
