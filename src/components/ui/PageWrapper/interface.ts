import { ReactNode } from "react";

export interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl" | "full";
  paddingTop?: "none" | "sm" | "md" | "lg" | "xl";
  paddingBottom?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "transparent";
}
