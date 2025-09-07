import type { DateValue } from "@internationalized/date";
import type {
  DateFieldState,
  DateSegment,
  DatePickerStateOptions,
  DateRangePickerStateOptions,
} from "react-stately";
import type { RangeValue } from "react-aria";
import type { PopoverPlacement } from "../../ui/Popover/interface";
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
  boundaryElement?: Element | null;
  scrollRef?: React.RefObject<Element | null>;
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
