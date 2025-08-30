"use client";

import { forwardRef, useId, useRef } from "react";
import { clsx } from "clsx";
import { FocusRing } from "@react-aria/focus";
import Icon from "../../Icon";
import type { CheckboxProps, CheckboxGroupProps } from "./interface";
import {
  fieldContainerStyles,
  fieldLabelStyles,
  fieldFeedbackStyles,
  checkboxContainerStyles,
  checkboxItemStyles,
  checkboxInputStyles,
  checkboxBoxStyles,
  checkboxCheckStyles,
  checkboxLabelContentStyles,
  checkboxLabelTextStyles,
  checkboxDescriptionStyles,
} from "../theme";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      value,
      checked,
      defaultChecked,

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
      description,
      checkIcon = "Check",
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const internalRef = useRef<HTMLInputElement>(null);

    const finalVariant = error ? "error" : variant;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked, event);
    };

    // Combine refs
    const combinedRef = (node: HTMLInputElement) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div className={clsx(fieldContainerStyles(), className)}>
        <div
          className={checkboxItemStyles({
            disabled,
          })}
        >
          <FocusRing focusRingClass="has-focus-ring" within>
            <label htmlFor={checkboxId} className="contents cursor-pointer">
              <input
                ref={combinedRef}
                id={checkboxId}
                name={name}
                type="checkbox"
                value={value}
                checked={checked}
                defaultChecked={defaultChecked}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                className={checkboxInputStyles()}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                aria-invalid={error}
                aria-describedby={
                  errorMessage || helperText || description
                    ? `${checkboxId}-feedback`
                    : undefined
                }
                {...rest}
              />

              <div
                className={checkboxBoxStyles({
                  variant: finalVariant,
                  disabled,
                })}
              >
                <div className={checkboxCheckStyles()}>
                  <Icon name={checkIcon} className="w-3 h-3 text-white" />
                </div>
              </div>

              {label && !hideLabel && (
                <div className={checkboxLabelContentStyles()}>
                  <span
                    className={checkboxLabelTextStyles({
                      disabled,
                      error,
                    })}
                  >
                    {label}
                    {required && <span className="ml-1">*</span>}
                  </span>
                  {description && (
                    <span
                      className={checkboxDescriptionStyles({
                        disabled,
                      })}
                    >
                      {description}
                    </span>
                  )}
                </div>
              )}
            </label>
          </FocusRing>
        </div>

        {(errorMessage || helperText) && (
          <div
            id={`${checkboxId}-feedback`}
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

Checkbox.displayName = "Checkbox";

export const CheckboxGroup = forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(
  (
    {
      id,
      name,
      value = [],
      items,
      variant = "default",
      className,
      orientation = "vertical",
      disabled = false,
      readOnly = false,
      required = false,
      error = false,
      errorMessage,
      helperText,
      label,
      hideLabel = false,
      description,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const groupId = id || generatedId;

    const handleItemChange = (
      itemValue: string,
      checked: boolean,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = checked
        ? [...value, itemValue]
        : value.filter((v) => v !== itemValue);

      onChange?.(newValue, event);
    };

    return (
      <fieldset
        ref={ref}
        id={groupId}
        className={clsx(fieldContainerStyles(), className)}
        disabled={disabled}
        aria-invalid={error}
        aria-describedby={
          errorMessage || helperText || description
            ? `${groupId}-feedback`
            : undefined
        }
        {...rest}
      >
        {label && !hideLabel && (
          <legend
            className={fieldLabelStyles({
              error,
              disabled,
            })}
          >
            {label}
            {required && <span className="ml-1">*</span>}
          </legend>
        )}

        {description && (
          <div
            className={checkboxDescriptionStyles({
              disabled,
            })}
          >
            {description}
          </div>
        )}

        <div
          className={checkboxContainerStyles({
            orientation,
            disabled,
          })}
        >
          {items.map((item) => (
            <Checkbox
              key={item.id}
              id={`${groupId}-${item.id}`}
              name={name}
              value={item.value}
              checked={value.includes(item.value)}
              disabled={disabled || item.disabled}
              readOnly={readOnly}
              variant={variant}
              label={item.label}
              description={item.description}
              error={error}
              onChange={(checked, event) =>
                handleItemChange(item.value, checked, event)
              }
              onFocus={onFocus}
              onBlur={onBlur}
            />
          ))}
        </div>

        {(errorMessage || helperText) && (
          <div
            id={`${groupId}-feedback`}
            className={fieldFeedbackStyles({
              type: error ? "error" : "helper",
            })}
          >
            {error ? errorMessage : helperText}
          </div>
        )}
      </fieldset>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";
