import { ReactNode, type HTMLAttributes } from "react";

export interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}
