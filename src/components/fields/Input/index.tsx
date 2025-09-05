"use client";

import { forwardRef, useId } from "react";
import { clsx } from "clsx";
import { FocusRing } from "@react-aria/focus";
import Icon from "../../ui/Icon";
import type { InputProps } from "./interface";
import {
  fieldContainerStyles,
  fieldLabelStyles,
  fieldWrapperStyles,
  fieldControlStyles,
  fieldIconStyles,
  fieldFeedbackStyles,
} from "../theme";

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
      <div className={clsx(fieldContainerStyles(), className)}>
        {label && !hideLabel && (
          <label
            htmlFor={inputId}
            className={fieldLabelStyles({
              error,
              disabled,
            })}
          >
            {label}
            {required && <span className="ml-1">*</span>}
          </label>
        )}

        <FocusRing focusRingClass="has-focus-ring" within>
          <div className={fieldWrapperStyles()}>
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
              className={fieldControlStyles({
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
              <div className={fieldIconStyles()}>
                <Icon name="Warning" className="text-error" />
              </div>
            )}

            {rightIcon && !error && (
              <div className={fieldIconStyles()}>
                <Icon name={rightIcon} />
              </div>
            )}
          </div>
        </FocusRing>

        {(errorMessage || helperText) && (
          <div
            id={`${inputId}-feedback`}
            className={fieldFeedbackStyles({
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
