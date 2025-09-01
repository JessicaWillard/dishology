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

// Checkbox specific styles
export const checkboxContainerStyles = tv({
  base: "flex items-start gap-6 mt-2",
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap",
    },
    disabled: {
      true: "opacity-65 pointer-events-none",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export const checkboxItemStyles = tv({
  base: "flex items-start gap-2 cursor-pointer group",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-65",
    },
  },
});

export const checkboxInputStyles = tv({
  base: "peer sr-only",
});

export const checkboxBoxStyles = tv({
  base: "relative flex items-center justify-center w-5 h-5 mt-0.5 border-2 rounded transition-all duration-200 ease-in-out group-hover:border-gray-dark focus-within:ring-2 focus-within:ring-primary-light focus-within:ring-offset-2",
  variants: {
    variant: {
      default:
        "border-gray-medium bg-white peer-checked:bg-primary peer-checked:border-primary",
      error:
        "border-error bg-white peer-checked:bg-error peer-checked:border-error",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const checkboxCheckStyles = tv({
  base: "absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 ease-in-out peer-checked:opacity-100",
});

export const checkboxLabelContentStyles = tv({
  base: "flex flex-col",
});

export const checkboxLabelTextStyles = tv({
  base: "text-sm text-black",
  variants: {
    disabled: {
      true: "text-gray-medium",
    },
    error: {
      true: "text-error",
    },
  },
});

export const checkboxDescriptionStyles = tv({
  base: "text-xs text-gray-dark mt-1",
  variants: {
    disabled: {
      true: "text-gray-medium",
    },
  },
});

export const datePickerContainer = tv({
  base: "relative inline-flex flex-col text-left w-full gap-2",
});

export const datePickerWrapper = tv({
  base: "w-full flex items-center gap-4 border-1 border-gray-dark rounded focus-ring-black",
});

export const datePickerCalendarPopoverUnderlay = tv({
  base: "fixed inset-0",
});

export const datePickerCalendarPopoverContainer = tv({
  base: "absolute top-full bg-white border border-gray-dark rounded-md shadow-lg mt-2 p-8 z-10",
});

export const datePickerDateField = tv({
  base: "pr-1 flex gap-2",
  defaultVariants: {
    dateFieldShown: true,
  },
  variants: {
    dateFieldShown: {
      true: "",
      false: "hidden",
    },
  },
});

export const datePickerDateSegment = tv({
  base: "focus-ring-black  focus:bg-blue-300",
});

export const datePickerIcon = tv({
  base: "text-primary bg-gray-light border-l-2 border-primary h-full py-2 px-2",
});

export const datePickerLabel = tv({
  base: "text-gray-medium font-bold px-2",
});
