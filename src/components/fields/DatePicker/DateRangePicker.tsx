"use client";
import { useDateRangePicker } from "@react-aria/datepicker";
import { useDateRangePickerState } from "@react-stately/datepicker";
import { useRef } from "react";
import { Box } from "../../Box";
import { Button } from "../../Button";
import RangeCalendar from "../../Calendar/RangeCalendar";
import { Dialog } from "../../Dialog";
import Icon from "../../Icon";
import { Popover } from "../../Popover";
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
            <DateField {...startFieldProps} /> –
            <DateField {...endFieldProps} />
            {state.isInvalid && "❌"}
          </div>
          <Button
            type="button"
            iconOnly
            variant="ghost"
            {...buttonProps}
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
              <DateField {...startFieldProps} /> -
              <DateField {...endFieldProps} />
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
