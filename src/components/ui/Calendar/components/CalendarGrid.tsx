import { getWeeksInMonth } from "@internationalized/date";
import { useCalendarGrid, useLocale } from "react-aria";
import { calendarTable, calendarDayLabel } from "../theme";
import type { TCalendarGridProps } from "../interface";
import CalendarCell from "./CalendarCell";

function CalendarGrid({ state, ...rest }: TCalendarGridProps) {
  const { locale } = useLocale();
  const { gridProps, headerProps } = useCalendarGrid({ ...rest }, state);
  const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  // Filter out isDisabled from gridProps and headerProps to avoid React warnings
  const { isDisabled: _gridIsDisabled, ...filteredGridProps } = gridProps;

  const { isDisabled: _headerIsDisabled, ...filteredHeaderProps } = headerProps;

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  const tableTheme = calendarTable();
  const dayLabelTheme = calendarDayLabel();

  return (
    <table {...filteredGridProps} cellPadding="0" className={tableTheme}>
      <thead {...filteredHeaderProps}>
        <tr>
          {weekDays.map((day) => (
            <th key={`day-${day}`} className={dayLabelTheme}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={`week-${weekIndex}`}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={date?.day} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CalendarGrid;
