"use client";
import { useDateRangePicker } from "react-aria";
import { useDateRangePickerState } from "react-stately";
import { useRef } from "react";
import { Box } from "../../ui/Box";
import { Button } from "../../ui/Button";
import RangeCalendar from "../../ui/Calendar/RangeCalendar";
import { Dialog } from "../../ui/Dialog";
import Icon from "../../ui/Icon";
import { Popover } from "../../ui/Popover";
import DateField from "./components/DateField";
import type { TDateRangePickerProps } from "./interface";
import {
  datePickerContainer,
  datePickerDateField,
  datePickerLabel,
  datePickerWrapper,
  datePickerCalendarPopoverContainer,
} from "../theme";

function DateRangePicker(props: TDateRangePickerProps) {
  const state = useDateRangePickerState(props);
  const ref = useRef<HTMLDivElement>(null);
  const {
    labelProps,
    descriptionProps,
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(props, state, ref);

  // Filter out isDisabled from field props to avoid React warnings
  const { isDisabled: _startFieldIsDisabled, ...filteredStartFieldProps } =
    startFieldProps;

  const { isDisabled: _endFieldIsDisabled, ...filteredEndFieldProps } =
    endFieldProps;

  // Filter out isDisabled from button props to avoid React warnings
  const { isDisabled: _buttonIsDisabled, ...filteredButtonProps } = buttonProps;

  const { label, buttonLabel, description, popoverPlacement, icon } = props;

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
            <DateField {...filteredStartFieldProps} /> –
            <DateField {...filteredEndFieldProps} />
            {state.isInvalid && "❌"}
          </div>
          <Button
            type="button"
            iconOnly
            variant="ghost"
            {...filteredButtonProps}
            handlePress={buttonProps.onPress as unknown as () => void}
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
          placement={popoverPlacement ?? "bottom start"}
          className={datePickerCalendarPopoverContainer()}
        >
          <Dialog {...dialogProps}>
            <div className={dateFieldTheme}>
              <DateField {...filteredStartFieldProps} /> -
              <DateField {...filteredEndFieldProps} />
              {state.isInvalid && "❌"}
            </div>
            <RangeCalendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  );
}

export default DateRangePicker;
