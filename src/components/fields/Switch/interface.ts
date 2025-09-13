import type React from "react";

export type SwitchVariant = "default" | "error";

export interface SwitchProps {
  // Core props
  id?: string;
  name?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;

  // Style variants
  variant?: SwitchVariant;
  className?: string;

  // State
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  // Validation and feedback
  error?: boolean;
  errorMessage?: string;
  helperText?: string;

  // Label and accessibility
  label?: string;
  hideLabel?: boolean;
  description?: string;

  // Events
  onChange?: (isSelected: boolean) => void;
  onFocus?: (event: React.FocusEvent<Element>) => void;
  onBlur?: (event: React.FocusEvent<Element>) => void;
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void;

  // Accessibility
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
