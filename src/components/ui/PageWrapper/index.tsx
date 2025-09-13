import { forwardRef } from "react";
import { tv } from "tailwind-variants";
import type { PageWrapperProps } from "./interface";

const pageWrapperStyles = tv({
  base: "min-h-screen",
  variants: {
    background: {
      white: "bg-white",
      gray: "bg-gray-50",
      transparent: "bg-transparent",
    },
  },
  defaultVariants: {
    background: "white",
  },
});

const containerStyles = tv({
  base: "mx-auto px-4 sm:px-6 lg:px-8",
  variants: {
    maxWidth: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "4xl": "max-w-4xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
    },
    paddingTop: {
      none: "pt-0",
      sm: "pt-4",
      md: "pt-8",
      lg: "pt-20",
      xl: "pt-40",
    },
    paddingBottom: {
      none: "pb-0",
      sm: "pb-4",
      md: "pb-8",
      lg: "pb-20",
      xl: "pb-40",
    },
  },
  defaultVariants: {
    maxWidth: "7xl",
  },
});

export const PageWrapper = forwardRef<HTMLDivElement, PageWrapperProps>(
  (
    {
      children,
      className,
      maxWidth = "7xl",
      paddingTop = "md",
      paddingBottom = "xl",
      background = "white",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={pageWrapperStyles({ background, className })}
        {...props}
      >
        <div
          className={containerStyles({ maxWidth, paddingTop, paddingBottom })}
        >
          {children}
        </div>
      </div>
    );
  }
);

PageWrapper.displayName = "PageWrapper";
