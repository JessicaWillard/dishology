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
  base: "mb-2 text-sm text-black",
  variants: {
    error: {
      true: "text-error",
    },
    disabled: {
      true: "opacity-65",
    },
  },
});

// Shared wrapper - from inputWrapperStyles
export const fieldWrapperStyles = tv({
  base: "relative flex items-center",
});

// Base field control styles - from inputStyles
export const fieldControlStyles = tv({
  base: "w-full outline-1 outline-gray-dark hover:outline-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-2 focus-ring-color-primary px-4 py-3 text-base min-h-[44px] placeholder:text-gray-medium",
  variants: {
    variant: {
      default: "bg-white text-black",
      error: "bg-white outline-error outline-2 text-black",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
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
  base: "absolute text-gray-dark pointer-events-none top-1/2 -translate-y-1/2 right-4",
});

// Shared feedback text styling - from feedbackStyles
export const fieldFeedbackStyles = tv({
  base: "mt-2 text-xs",
  variants: {
    type: {
      error: "text-error",
      helper: "text-gray-dark",
    },
  },
});

// ComboBox specific styles
export const comboBoxButtonStyles = tv({
  base: "absolute top-1/2 -translate-y-1/2 right-4 text-gray-dark pointer-events-auto cursor-pointer hover:text-black transition-colors duration-200 focus:outline-none focus:text-black",
});

export const comboBoxListBoxStyles = tv({
  base: "absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto focus:outline-none",
});

export const comboBoxOptionStyles = tv({
  base: "px-4 py-3 cursor-pointer text-base first:rounded-t-xl last:rounded-b-xl hover:bg-gray-light",
  variants: {
    isSelected: {
      true: "bg-gray-dark text-white hover:bg-gray-dark hover:text-white",
    },
    isDisabled: {
      true: "pointer-events-none opacity-65",
    },
  },
});
