"use client";

import { forwardRef, useId, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { FocusRing } from "@react-aria/focus";
import Icon from "../../Icon";
import type { TextAreaProps } from "./interface";
import {
  fieldContainerStyles,
  fieldLabelStyles,
  fieldWrapperStyles,
  fieldControlStyles,
  fieldIconStyles,
  fieldFeedbackStyles,
} from "../theme";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      rows = 4,
      cols,
      resize = "vertical",
      autoExpand = false,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const textAreaId = id || generatedId;
    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Auto-expand functionality
    useEffect(() => {
      if (autoExpand && internalRef.current) {
        const textArea = internalRef.current;
        const adjustHeight = () => {
          textArea.style.height = "auto";
          textArea.style.height = `${textArea.scrollHeight}px`;
        };

        // Adjust height on mount and value change
        adjustHeight();

        // Add event listener for input changes
        textArea.addEventListener("input", adjustHeight);

        return () => {
          textArea.removeEventListener("input", adjustHeight);
        };
      }
    }, [autoExpand, value]);

    const finalVariant = error ? "error" : variant;
    const hasRightIcon = !!rightIcon || error;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event.target.value, event);
    };

    // Combine refs
    const combinedRef = (node: HTMLTextAreaElement) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const textAreaStyles = clsx(
      fieldControlStyles({
        variant: finalVariant,
        disabled,
        hasRightIcon,
      }),
      // Override min-height for textarea and add resize behavior
      "min-h-[100px]",
      {
        "resize-none": resize === "none",
        resize: resize === "both",
        "resize-x": resize === "horizontal",
        "resize-y": resize === "vertical",
      },
      // Auto-expand removes resize
      autoExpand && "resize-none overflow-hidden"
    );

    return (
      <div className={clsx(fieldContainerStyles(), className)}>
        {label && !hideLabel && (
          <label
            htmlFor={textAreaId}
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
            <textarea
              ref={combinedRef}
              id={textAreaId}
              name={name}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              rows={rows}
              cols={cols}
              className={textAreaStyles}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              aria-invalid={error}
              aria-describedby={
                errorMessage || helperText
                  ? `${textAreaId}-feedback`
                  : undefined
              }
              {...rest}
            />

            {error && !rightIcon && (
              <div className={clsx(fieldIconStyles(), "top-4 translate-y-0")}>
                <Icon name="Warning" className="text-error" />
              </div>
            )}

            {rightIcon && !error && (
              <div className={clsx(fieldIconStyles(), "top-4 translate-y-0")}>
                <Icon name={rightIcon} />
              </div>
            )}
          </div>
        </FocusRing>

        {(errorMessage || helperText) && (
          <div
            id={`${textAreaId}-feedback`}
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

TextArea.displayName = "TextArea";
