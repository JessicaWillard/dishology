import type React from "react";

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  width?: "half" | "full";
  position?: "left" | "right";
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}
