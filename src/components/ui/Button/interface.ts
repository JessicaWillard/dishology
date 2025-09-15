import type React from "react";

export interface TBaseButtonProps {
  className?: string;
  children?: React.ReactNode;

  // Functionality props
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconOnly?: boolean;
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
