import type { IconName } from "@/components/ui/Icon";
import type React from "react";

export type ComboBoxVariant = "default" | "error";

export interface ComboBoxItem {
  id: string | number;
  name: string;
  value?: string;
  disabled?: boolean;
}

export interface ComboBoxProps<T extends ComboBoxItem = ComboBoxItem> {
  // Core props
  id?: string;
  name?: string;
  value?: string | null;
  defaultValue?: string | null;
  placeholder?: string;

  // Data
  items: T[];
  selectedKey?: string | number | null;
  defaultSelectedKey?: string | number | null;

  // Style variants
  variant?: ComboBoxVariant;
  className?: string;

  // State
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  allowsCustomValue?: boolean;

  // Validation and feedback
  error?: boolean;
  errorMessage?: string;
  helperText?: string;

  // Label and accessibility
  label?: string;
  hideLabel?: boolean;
  description?: string;

  // Icons
  rightIcon?: IconName | string;

  // Menu behavior
  menuTrigger?: "focus" | "input" | "manual";
  allowsEmptyCollection?: boolean;

  // Filtering
  inputValue?: string;
  defaultInputValue?: string;

  // Events
  onSelectionChange?: (key: string | number | null) => void;
  onInputChange?: (value: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // Accessibility
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}
