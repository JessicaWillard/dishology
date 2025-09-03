import type { DateValue } from "@internationalized/date";
import type {
  DateFieldState,
  DateSegment,
  DatePickerStateOptions,
  DateRangePickerStateOptions,
} from "@react-stately/datepicker";
import type { RangeValue } from "@react-types/shared";
import type { PopoverPlacement } from "../../Popover/interface";
export interface TDateSegmentProps {
  segment: DateSegment;
  state: DateFieldState;
}

export interface TDatePickerProps extends DatePickerStateOptions<DateValue> {
  label?: string;
  popoverPlacement?: PopoverPlacement;
  icon?: string;
  buttonLabel?: string;
  description?: string;
}

export interface TDateRangePickerProps
  extends DateRangePickerStateOptions<DateValue> {
  buttonLabel?: string;
  label?: string;
  description?: string;
  icon?: string;
  popoverPlacement?: PopoverPlacement;
  minValue?: DateValue;
  value?: {
    start: DateValue;
    end: DateValue;
  };
  onChange?: (value: RangeValue<DateValue> | null) => void;
}
