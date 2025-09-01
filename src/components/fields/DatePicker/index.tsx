"use client";

import { useDatePicker } from "@react-aria/datepicker";
import { useDatePickerState } from "@react-stately/datepicker";
import { useRef } from "react";
import { Box } from "../../Box";
import { Button } from "../../Button";
import Calendar from "../../Calendar";
import { Dialog } from "../../Dialog";
import Icon from "../../Icon";
import { Popover } from "../../Popover";
import DateField from "./components/DateField";
import type { TDatePickerProps } from "./interface";
import {
  datePickerContainer,
  datePickerDateField,
  datePickerWrapper,
  datePickerCalendarPopoverContainer,
} from "../theme";
import { datePickerLabel } from "../theme";

function DatePicker({
  popoverPlacement = "bottom start",
  icon,
  description,
  buttonLabel,
  ...rest
}: TDatePickerProps) {
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
            <DateField {...fieldProps} />
            {state.isInvalid && "❌"}
          </div>
          <Button
            {...buttonProps}
            iconOnly
            variant="ghost"
            type="button"
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
          placement={popoverPlacement}
          className={datePickerCalendarPopoverContainer()}
        >
          <Dialog {...dialogProps}>
            <div>
              <DateField {...fieldProps} />
              {state.isInvalid && "❌"}
            </div>
            <Calendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  );
}

export default DatePicker;
