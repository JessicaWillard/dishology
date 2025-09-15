"use client";

import { forwardRef, useId } from "react";
import { clsx } from "clsx";
import { Switch as ReactAriaSwitch } from "react-aria-components";
import type { SwitchProps } from "./interface";
import {
  fieldContainerStyles,
  fieldFeedbackStyles,
  switchContainerStyles,
  switchTrackStyles,
  switchThumbStyles,
  switchLabelContentStyles,
  switchLabelTextStyles,
  switchDescriptionStyles,
} from "../theme";

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (
    {
      id,
      name,
      isSelected,
      defaultSelected,
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
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    const finalVariant = error ? "error" : variant;

    const handleChange = (isSelected: boolean) => {
      onChange?.(isSelected);
    };

    return (
      <div className={clsx(fieldContainerStyles(), className)}>
        <div
          className={switchContainerStyles({
            disabled,
          })}
        >
          <ReactAriaSwitch
            ref={ref}
            id={switchId}
            name={name}
            isSelected={isSelected}
            defaultSelected={defaultSelected}
            isDisabled={disabled}
            isReadOnly={readOnly}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            aria-invalid={error}
            aria-describedby={
              errorMessage || helperText || description
                ? `${switchId}-feedback`
                : undefined
            }
            {...rest}
          >
            {({ isSelected: ariaIsSelected }) => (
              <>
                {label && !hideLabel && (
                  <div className={switchLabelContentStyles()}>
                    <span
                      className={switchLabelTextStyles({
                        disabled,
                        error,
                      })}
                    >
                      {label}
                      {required && <span className="ml-1">*</span>}
                    </span>
                    {description && (
                      <span
                        className={switchDescriptionStyles({
                          disabled,
                        })}
                      >
                        {description}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={switchTrackStyles({
                    variant: finalVariant,
                    isSelected: ariaIsSelected,
                    disabled,
                  })}
                >
                  <div
                    className={switchThumbStyles({
                      isSelected: ariaIsSelected,
                    })}
                  />
                </div>
              </>
            )}
          </ReactAriaSwitch>
        </div>

        {(errorMessage || helperText) && (
          <div
            id={`${switchId}-feedback`}
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

Switch.displayName = "Switch";
