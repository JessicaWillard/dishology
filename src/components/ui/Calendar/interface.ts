import type { CalendarDate, DateValue } from "@internationalized/date";
import type {
  CalendarProps,
  RangeCalendarProps,
  AriaCalendarGridProps,
} from "react-aria";
import type { CalendarState, RangeCalendarState } from "react-stately";

export interface TCalendarProps extends CalendarProps<DateValue> {
  buttons?: {
    buttonPrev?: {
      icon?: string;
    };
    buttonNext?: {
      icon?: string;
    };
  };
}

export interface TRangeCalendarProps extends RangeCalendarProps<DateValue> {
  buttons?: {
    buttonPrev?: {
      icon?: string;
    };
    buttonNext?: {
      icon?: string;
    };
  };
}

export interface TCalendarGridProps extends AriaCalendarGridProps {
  state: RangeCalendarState | CalendarState;
}

export interface TCalendarCellProps {
  state: RangeCalendarState | CalendarState;
  date: CalendarDate;
}
