/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { forwardRef, useId, useRef } from "react";
import { clsx } from "clsx";
import { FocusRing } from "@react-aria/focus";
import { useButton, useComboBox, useFilter, useOption } from "react-aria";
import { useComboBoxState } from "react-stately";
import { Item } from "@react-stately/collections";
import type { AriaButtonProps } from "@react-types/button";
import type { ComboBoxState } from "react-stately";
import type { Node } from "@react-types/shared";
import type { AriaListBoxProps } from "@react-types/listbox";
import Icon from "../../ui/Icon";
import type { ComboBoxProps } from "./interface";
import {
  fieldContainerStyles,
  fieldLabelStyles,
  fieldWrapperStyles,
  fieldControlStyles,
  fieldIconStyles,
  fieldFeedbackStyles,
  comboBoxButtonStyles,
  comboBoxListBoxStyles,
  comboBoxOptionStyles,
} from "../theme";

// Internal components for better organization
const ComboBoxButton = ({ buttonProps }: { buttonProps: AriaButtonProps }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { buttonProps: ariaButtonProps } = useButton(buttonProps, buttonRef);

  return (
    <button
      {...ariaButtonProps}
      ref={buttonRef}
      className={comboBoxButtonStyles()}
      aria-label="Show options"
    >
      <Icon name="ChevronDown" />
    </button>
  );
};

const ComboBoxListBox = ({
  listBoxRef,
  listBoxProps,
  state,
}: {
  listBoxRef: React.RefObject<HTMLUListElement | null>;
  listBoxProps: Omit<AriaListBoxProps<object>, "children">;
  state: ComboBoxState<object>;
}) => {
  // Filter out React-specific props that shouldn't be passed to DOM elements
  const {
    // Extract React-specific props to prevent them from being spread to DOM
    autoFocus: _,
    shouldSelectOnPressUp: __,
    shouldFocusOnHover: ___,
    ...filteredListBoxProps
  } = listBoxProps;

  return (
    <ul
      {...filteredListBoxProps}
      ref={listBoxRef}
      className={comboBoxListBoxStyles()}
    >
      {[...state.collection].map((item) => (
        <ComboBoxOption key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
};

const ComboBoxOption = ({
  item,
  state,
}: {
  item: Node<object>;
  state: ComboBoxState<object>;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const { optionProps, isSelected } = useOption({ key: item.key }, state, ref);

  return (
    <li
      {...optionProps}
      ref={ref}
      className={comboBoxOptionStyles({
        isSelected,
        isDisabled: item.props?.isDisabled,
      })}
    >
      {item.rendered}
    </li>
  );
};

export const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(
  (
    {
      id,
      name,
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
      items = [],
      selectedKey,
      defaultSelectedKey,
      allowsCustomValue = false,
      menuTrigger = "input",
      allowsEmptyCollection = true,
      inputValue,
      defaultInputValue,
      onSelectionChange,
      onInputChange,
      onOpenChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const comboBoxId = id || generatedId;

    const inputRef = useRef<HTMLInputElement>(null);
    const listBoxRef = useRef<HTMLUListElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Don't override the input onChange - react-aria handles this internally
    // Only call user's onInputChange when the state actually changes
    const handleInputChange = (value: string) => {
      onInputChange?.(value);
    };

    // Set up filtering
    const { contains } = useFilter({ sensitivity: "base" });

    // Initialize ComboBox state
    const state = useComboBoxState({
      children: items.map((item) => (
        <Item key={item.id} textValue={item.name}>
          {item.name}
        </Item>
      )),
      selectedKey: selectedKey ?? undefined,
      defaultSelectedKey: defaultSelectedKey ?? undefined,
      inputValue: inputValue ?? undefined,
      defaultInputValue: defaultInputValue || defaultValue || undefined,
      allowsCustomValue,
      menuTrigger,
      allowsEmptyCollection,
      onSelectionChange,
      onInputChange: handleInputChange,
      onOpenChange,
      defaultFilter: contains,
    });

    // Get ComboBox props
    const { inputProps, buttonProps, listBoxProps, labelProps } = useComboBox(
      {
        id: comboBoxId,
        name,
        placeholder,
        isDisabled: disabled,
        isReadOnly: readOnly,
        isRequired: required,
        menuTrigger,
        allowsCustomValue,
        inputRef,
        popoverRef,
        listBoxRef,
        onFocus,
        onBlur,
        onKeyDown,
        "aria-label": rest["aria-label"],
        "aria-labelledby": rest["aria-labelledby"],
        "aria-describedby": rest["aria-describedby"],
      },
      state
    );

    // useComboBox already handles all trigger behavior, no need for useOverlayTrigger

    const finalVariant = error ? "error" : variant;
    const hasRightIcon = !!rightIcon || error || true; // Always show chevron

    return (
      <div className={clsx(fieldContainerStyles(), className)}>
        {label && !hideLabel && (
          <label
            {...labelProps}
            htmlFor={comboBoxId}
            className={fieldLabelStyles({
              error,
              disabled,
            })}
          >
            {label}
            {required && <span>*</span>}
          </label>
        )}

        <FocusRing focusRingClass="has-focus-ring" within>
          <div className={clsx(fieldWrapperStyles(), "relative")}>
            <input
              {...inputProps}
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === "function") {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              id={comboBoxId}
              name={name}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              className={fieldControlStyles({
                variant: finalVariant,
                disabled,
                hasRightIcon,
              })}
              aria-invalid={error}
              aria-describedby={
                errorMessage || helperText
                  ? `${comboBoxId}-feedback`
                  : undefined
              }
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

            {!rightIcon && !error && (
              <ComboBoxButton buttonProps={buttonProps} />
            )}

            {state.isOpen && (
              <div ref={popoverRef}>
                <ComboBoxListBox
                  listBoxRef={listBoxRef}
                  listBoxProps={listBoxProps}
                  state={state}
                />
              </div>
            )}
          </div>
        </FocusRing>

        {(errorMessage || helperText) && (
          <div
            id={`${comboBoxId}-feedback`}
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

ComboBox.displayName = "ComboBox";
