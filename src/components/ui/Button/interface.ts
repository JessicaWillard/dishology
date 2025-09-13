import type React from "react";

// Variant types kept in sync with the implementation
export type ButtonVariant =
  | "solid"
  | "outline"
  | "ghost"
  | "destructive"
  | "tag";

export interface TBaseButtonProps {
  className?: string;
  children?: React.ReactNode;

  // Style variants
  variant?: ButtonVariant;
  iconOnly?: boolean;

  // Extras
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export interface TButtonProps
  extends TBaseButtonProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "className" | "children" | "onClick" | "disabled"
    > {
  id?: string;
  handlePress?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isDisabled?: boolean;
  href?: undefined; // ensure union discrimination
}

export interface TAnchorProps
  extends TBaseButtonProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "className" | "children" | "onClick" | "href"
    > {
  href: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  handlePress?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type ButtonProps = TButtonProps | TAnchorProps;
