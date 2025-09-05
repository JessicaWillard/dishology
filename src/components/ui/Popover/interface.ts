import type React from "react";
import type { Placement } from "@react-aria/overlays";

export type PopoverPlacement = Placement;

export interface PopoverProps {
  // Core props
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;

  // Positioning
  placement: PopoverPlacement;
  offset?: number;
  shouldFlip?: boolean;

  // Trigger element (for positioning)
  triggerRef: React.RefObject<Element>;

  // Style
  className?: string;

  // Interaction
  isDismissable?: boolean;
  shouldCloseOnBlur?: boolean;
  shouldCloseOnInteractOutside?: boolean;

  // Accessibility
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
