import type { IconName } from "@/components/ui/Icon";
import type React from "react";

export type TextAreaVariant = "default" | "error";

export interface TextAreaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "size" | "onChange"
  > {
  // Core props
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;

  // Style variants
  variant?: TextAreaVariant;
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

  // TextArea-specific props
  rows?: number;
  cols?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  autoExpand?: boolean;

  // Events
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}
