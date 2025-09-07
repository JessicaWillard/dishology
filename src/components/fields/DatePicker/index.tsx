"use client";

import { useDatePicker, type PressEvent } from "react-aria";
import { useDatePickerState } from "react-stately";
import { useRef } from "react";
import { Box } from "../../ui/Box";
import { Button } from "../../ui/Button";
import Calendar from "../../ui/Calendar";
import { Dialog } from "../../ui/Dialog";
import Icon from "../../ui/Icon";
import { Popover } from "../../ui/Popover";
import DateField from "./components/DateField";
import type { TDatePickerProps } from "./interface";
import {
  datePickerContainer,
  datePickerDateField,
  datePickerWrapper,
  datePickerCalendarPopoverContainer,
} from "../theme";
import { datePickerLabel } from "../theme";

export const DatePicker = ({
  popoverPlacement = "bottom start",
  icon,
  description,
  buttonLabel,
  ...rest
}: TDatePickerProps) => {
  const state = useDatePickerState({ ...rest });
  const ref = useRef<HTMLDivElement>(null);
  const {
    groupProps,
    fieldProps,
    labelProps,
    descriptionProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker({ ...rest }, state, ref);

  // Extract only the props we need from buttonProps to avoid React warnings
  const {
    onPress,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    "aria-expanded": ariaExpanded,
    "aria-haspopup": ariaHaspopup,
    isDisabled,
  } = buttonProps;

  // Filter out isDisabled from fieldProps to avoid React warnings
  const { isDisabled: _, ...filteredFieldProps } = fieldProps;

  const { label } = { ...rest };

  const containerTheme = datePickerContainer();
  const dateFieldTheme = datePickerDateField();
  const labelTheme = datePickerLabel();

  return (
    <div className={containerTheme}>
      {label && <span {...labelProps}>{label}</span>}
      {description && <div {...descriptionProps}>{description}</div>}
      <div {...groupProps} ref={ref}>
        <Box className={datePickerWrapper()}>
          {buttonLabel && <p className={labelTheme}>{buttonLabel}</p>}
          <div className={dateFieldTheme}>
            <DateField {...filteredFieldProps} />
            {state.isInvalid && "❌"}
          </div>
          <Button
            iconOnly
            variant="ghost"
            type="button"
            handlePress={
              onPress
                ? (e: React.MouseEvent<HTMLButtonElement>) =>
                    onPress?.(e as unknown as PressEvent)
                : undefined
            }
            id={id}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
            aria-expanded={ariaExpanded}
            aria-haspopup={ariaHaspopup}
            disabled={!!isDisabled}
          >
            <Icon name={icon || "Calendar"} />
          </Button>
        </Box>
      </div>
      {state.isOpen && (
        <Popover
          triggerRef={ref as React.RefObject<Element>}
          isOpen={state.isOpen}
          onOpenChange={state.setOpen}
          placement={popoverPlacement}
          className={datePickerCalendarPopoverContainer()}
        >
          <Dialog {...dialogProps}>
            <div>
              <DateField {...filteredFieldProps} />
              {state.isInvalid && "❌"}
            </div>
            <Calendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  );
};

DatePicker.displayName = "DatePicker";
