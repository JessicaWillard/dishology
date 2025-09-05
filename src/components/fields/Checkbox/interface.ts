import type { IconName } from "@/components/ui/Icon";
import type React from "react";

export type CheckboxVariant = "default" | "error";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "type"
  > {
  // Core props
  id?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;

  // Style variants
  variant?: CheckboxVariant;
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

  // Icons (for custom check mark)
  checkIcon?: IconName | string;

  // Events
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // Accessibility
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export interface CheckboxGroupItem {
  id: string | number;
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

export interface CheckboxGroupProps {
  // Core props
  id?: string;
  name?: string;
  value?: string[];

  // Data
  items: CheckboxGroupItem[];

  // Style variants
  variant?: CheckboxVariant;
  className?: string;
  orientation?: "vertical" | "horizontal";

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
  onChange?: (
    value: string[],
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  // Accessibility
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
