"use client";

import { forwardRef, useId } from "react";
import { tv } from "tailwind-variants";
import { clsx } from "clsx";
import { FocusRing } from "@react-aria/focus";
import Icon from "../../Icon";
import type { InputProps } from "./interface";

const inputContainerStyles = tv({
  base: "relative flex flex-col",
});

const labelStyles = tv({
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

const inputWrapperStyles = tv({
  base: "relative flex items-center",
});

const inputStyles = tv({
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

const iconStyles = tv({
  base: "absolute text-gray-400 pointer-events-none top-1/2 -translate-y-1/2 right-4",
});

const feedbackStyles = tv({
  base: "mt-2 text-sm",
  variants: {
    type: {
      error: "text-error",
      helper: "text-gray-400",
    },
  },
});

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      placeholder,
      variant = "default",
      className,
      disabled = false,
      readOnly = false,
      required = false,
      error = false,
      errorMessage,
      helperText,
      label,
      hideLabel = false,
      rightIcon,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const finalVariant = error ? "error" : variant;
    const hasRightIcon = !!rightIcon || error;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value, event);
    };

    return (
      <div className={clsx(inputContainerStyles(), className)}>
        {label && !hideLabel && (
          <label
            htmlFor={inputId}
            className={labelStyles({
              error,
              disabled,
            })}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <FocusRing focusRingClass="has-focus-ring" within>
          <div className={inputWrapperStyles()}>
            <input
              ref={ref}
              id={inputId}
              name={name}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              className={inputStyles({
                variant: finalVariant,
                disabled,
                hasRightIcon,
              })}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              aria-invalid={error}
              aria-describedby={
                errorMessage || helperText ? `${inputId}-feedback` : undefined
              }
              {...rest}
            />

            {error && !rightIcon && (
              <div className={iconStyles()}>
                <Icon name="Warning" className="text-error" />
              </div>
            )}

            {rightIcon && !error && (
              <div className={iconStyles()}>
                <Icon name={rightIcon} />
              </div>
            )}
          </div>
        </FocusRing>

        {(errorMessage || helperText) && (
          <div
            id={`${inputId}-feedback`}
            className={feedbackStyles({
              type: error ? "error" : "helper",
            })}
          >
            {error ? errorMessage : helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { inputStyles, inputContainerStyles, labelStyles };
export type { InputProps } from "./interface";
