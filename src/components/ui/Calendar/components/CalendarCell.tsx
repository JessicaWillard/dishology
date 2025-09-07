import { isSameDay, getDayOfWeek } from "@internationalized/date";
import {
  useCalendarCell,
  useFocusRing,
  mergeProps,
  useLocale,
} from "react-aria";
import type { RangeCalendarState } from "react-stately";
import { useRef } from "react";
import {
  calendarCell,
  calendarCellContainer,
  calendarCellFormattedDate,
} from "../theme";
import type { TCalendarCellProps } from "../interface";

function CalendarCell({ state, date }: TCalendarCellProps) {
  const ref = useRef(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref);

  // The start and end date of the selected range will have
  // an emphasized appearance.

  const range = (state as RangeCalendarState)?.highlightedRange;
  const startDate = range?.start;
  const endDate = range?.end;

  const isSelectionStart =
    range && startDate ? isSameDay(date, startDate) : isSelected;
  const isSelectionEnd =
    range && endDate ? isSameDay(date, endDate) : isSelected;

  const { locale } = useLocale();
  const dayOfWeek = getDayOfWeek(date, locale);
  const isRoundedLeft =
    isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date));

  const { focusProps, isFocusVisible } = useFocusRing();

  const cellContainerTheme = calendarCellContainer({ isFocusVisible });
  const cellTheme = calendarCell({
    isSelected,
    isInvalid,
    isDisabled,
    isRoundedLeft,
    isRoundedRight,
  });
  const cellDate = calendarCellFormattedDate({
    isSelected,
    isInvalid,
    isDisabled,
    isSelectionStart,
    isSelectionEnd,
  });

  return (
    <td {...cellProps} aria-disabled={false} className={cellContainerTheme}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={cellTheme}
      >
        <div className={cellDate}>{formattedDate}</div>
      </div>
    </td>
  );
}

export default CalendarCell;
