"use client";

import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import { clsx } from "clsx";
import type { ButtonProps } from "./interface";
import { Icon } from "../Icon";

const buttonStyles = tv(
  {
    base: "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium transition-all duration-300 ease-in-out min-h-[44px] min-w-[44px] px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    variants: {
      variant: {
        solid: "bg-primary text-white hover:bg-black",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost:
          "text-primary hover:text-secondary !min-w-0 !min-h-0 !px-0 !rounded-none",
        destructive:
          "text-error hover:text-black !min-w-0 !min-h-0 !px-0 !rounded-none",
        tag: "bg-gray-dark text-white hover:bg-gray-dark/80 !px-2 !py-1 text-xs !min-h-auto !min-w-auto !rounded-md [&_svg]:h-4 [&_svg]:w-4",
      },
      iconOnly: {
        true: "!px-0",
      },
    },
    defaultVariants: {
      variant: "solid",
      iconOnly: false,
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
    isLoading,
    leftIcon,
    rightIcon,
    children,
    iconOnly,
    handlePress,
    ...rest
  } = props as ButtonProps;

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
      linkBehavior: _ignoreLinkBehavior,
      isDisabled: _ignoreIsDisabled,
      ...anchorProps
    } = rest as ExtendedAnchorProps;
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

  type ExtendedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    linkBehavior?: unknown;
    isDisabled?: boolean;
  };
  const {
    linkBehavior: _ignoreLinkBehavior,
    isDisabled: _ignoreIsDisabled,
    ...buttonProps
  } = rest as ExtendedButtonProps;
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
