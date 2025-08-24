import type { IconName } from "@/components/Icon";
import type React from "react";

export type InputVariant = "default" | "error";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange"
  > {
  // Core props
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;

  // Style variants
  variant?: InputVariant;
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

  // Icons
  rightIcon?: IconName | string;

  // Events
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
