import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { clsx } from "clsx";

const pageWrapperStyles = tv(
  {
    base: "min-h-screen mt-[65px]",
    variants: {
      background: {
        white: "bg-white",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      background: "white",
    },
  },
  { twMerge: true }
);

const containerStyles = tv(
  {
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
      marginTop: {
        none: "mt-0",
        sm: "mt-4",
        md: "mt-8",
        lg: "mt-20",
        xl: "mt-50",
      },
      marginBottom: {
        none: "mb-0",
        sm: "mb-4",
        md: "mb-8",
        lg: "mb-20",
        xl: "mb-40",
      },
    },
    defaultVariants: {
      maxWidth: "7xl",
      marginTop: "none",
      marginBottom: "xl",
    },
  },
  { twMerge: true }
);

export type PageWrapperProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
  maxWidth?: VariantProps<typeof containerStyles>["maxWidth"];
  marginTop?: VariantProps<typeof containerStyles>["marginTop"];
  marginBottom?: VariantProps<typeof containerStyles>["marginBottom"];
  background?: VariantProps<typeof pageWrapperStyles>["background"];
};

export const PageWrapper = forwardRef<HTMLDivElement, PageWrapperProps>(
  (
    {
      children,
      className,
      maxWidth,
      marginTop,
      marginBottom,
      background,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(pageWrapperStyles({ background }), className)}
        {...props}
      >
        <div className={containerStyles({ maxWidth, marginTop, marginBottom })}>
          {children}
        </div>
      </div>
    );
  }
);

PageWrapper.displayName = "PageWrapper";

export { pageWrapperStyles, containerStyles };
