import { tv } from "tailwind-variants";

/**
 * Centralized field theme system for consistent styling across form components
 * Extracted from existing Input component styles
 */

// Shared field container - from inputContainerStyles
export const fieldContainerStyles = tv({
  base: "relative flex flex-col",
});

// Shared label styling - from labelStyles
export const fieldLabelStyles = tv({
  base: "mb-2 font-medium text-black",
  variants: {
    error: {
      true: "text-error",
    },
    disabled: {
      true: "text-gray-400",
    },
  },
});

// Shared wrapper - from inputWrapperStyles
export const fieldWrapperStyles = tv({
  base: "relative flex items-center",
});

// Base field control styles - from inputStyles
export const fieldControlStyles = tv({
  base: "w-full border-2 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus-ring-color-1-500 px-4 py-3 text-base min-h-[44px]",
  variants: {
    variant: {
      default: "border-gray-200 bg-white text-black",
      error: "border-error bg-white text-black",
    },
    disabled: {
      true: "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50",
      false: "bg-white text-black",
    },
    hasRightIcon: {
      true: "pr-12",
    },
  },
  defaultVariants: {
    variant: "default",
    disabled: false,
  },
});

// Shared icon positioning - from iconStyles
export const fieldIconStyles = tv({
  base: "absolute text-gray-400 pointer-events-none top-1/2 -translate-y-1/2 right-4",
});

// Shared feedback text styling - from feedbackStyles
export const fieldFeedbackStyles = tv({
  base: "mt-2 text-sm",
  variants: {
    type: {
      error: "text-error",
      helper: "text-gray-400",
    },
  },
});
