"use client";

import { useEffect } from "react";
import { animated, useTransition } from "@react-spring/web";
import { Box } from "../Box";
import { Button } from "../Button";
import type { SidePanelProps } from "./interface";
import { Icon } from "../Icon";

export const SidePanel = ({
  isOpen,
  onClose,
  children,
  className,
  width = "half",
  position = "right",
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: SidePanelProps) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const widthClasses = {
    half: "w-full lg:w-1/2",
    full: "w-full",
  };

  const positionClasses = {
    left: "left-0",
    right: "right-0",
  };

  const slideDirection = position === "right" ? "100%" : "-100%";

  const overlayTransition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const panelTransition = useTransition(isOpen, {
    from: {
      opacity: 0,
      transform: `translateX(${slideDirection})`,
    },
    enter: {
      opacity: 1,
      transform: "translateX(0%)",
    },
    leave: {
      opacity: 0,
      transform: `translateX(${slideDirection})`,
    },
  });

  return (
    <>
      {/* Overlay */}
      {showOverlay &&
        overlayTransition(
          (styles, item) =>
            item && (
              <animated.div
                className="fixed inset-0 bg-black/50 z-40"
                style={styles}
                onClick={closeOnOverlayClick ? onClose : undefined}
              />
            )
        )}

      {/* Side Panel */}
      {panelTransition(
        (styles, item) =>
          item && (
            <animated.div
              className={`fixed top-0 ${
                positionClasses[position]
              } h-full z-50 ${widthClasses[width]} ${className || ""}`}
              style={styles}
            >
              <Box
                className="h-full bg-white"
                padding="none"
                display="flexCol"
                radius="none"
                shadow="lg"
              >
                {/* Header */}
                <Box
                  padding="md"
                  display="flexRow"
                  justify="end"
                  align="center"
                >
                  <Button variant="ghost" iconOnly handlePress={onClose}>
                    <Icon name="CloseBtn" />
                  </Button>
                </Box>

                {/* Content */}
                <Box className="flex-1 overflow-y-auto" padding="md">
                  {children}
                </Box>
              </Box>
            </animated.div>
          )
      )}
    </>
  );
};

SidePanel.displayName = "SidePanel";
