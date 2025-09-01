"use client";

import { useRef } from "react";
import {
  useOverlay,
  useOverlayPosition,
  DismissButton,
  FocusScope,
} from "react-aria";
import { OverlayContainer } from "react-aria";
import { tv } from "tailwind-variants";
import { clsx } from "clsx";
import type { PopoverProps } from "./interface";

const popoverStyles = tv({
  base: "bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 outline-none",
});

export const Popover = ({
  children,
  isOpen,
  onOpenChange,
  placement = "bottom",
  offset = 8,
  shouldFlip = true,
  triggerRef,
  className,
  isDismissable = true,
  shouldCloseOnBlur = true,
  shouldCloseOnInteractOutside = true,
  ...ariaProps
}: PopoverProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle overlay behavior (focus management, dismiss)
  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose: () => onOpenChange?.(false),
      shouldCloseOnBlur,
      shouldCloseOnInteractOutside: shouldCloseOnInteractOutside
        ? () => true
        : () => false,
      isDismissable,
    },
    overlayRef
  );

  // Handle positioning relative to trigger
  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement,
    offset,
    shouldFlip,
    isOpen,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <OverlayContainer>
      <FocusScope contain restoreFocus autoFocus>
        <div
          ref={overlayRef}
          className={clsx(popoverStyles(), className)}
          style={{
            ...positionProps.style,
            position: "absolute",
          }}
          {...overlayProps}
          {...ariaProps}
        >
          {/* Invisible dismiss button for screen readers */}
          <DismissButton onDismiss={() => onOpenChange?.(false)} />

          {children}

          {/* Invisible dismiss button for screen readers */}
          <DismissButton onDismiss={() => onOpenChange?.(false)} />
        </div>
      </FocusScope>
    </OverlayContainer>
  );
};

Popover.displayName = "Popover";
