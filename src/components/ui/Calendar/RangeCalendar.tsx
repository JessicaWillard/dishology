import { createCalendar } from "@internationalized/date";
import { useRangeCalendar, useLocale } from "react-aria";
import { useRangeCalendarState } from "react-stately";
import { useRef } from "react";
import { Button } from "../Button";
import Icon from "../Icon";
import { Text } from "../Text";
import CalendarGrid from "./components/CalendarGrid";
import type { TRangeCalendarProps } from "./interface";
import {
  calendarContainer,
  calendarHeaderContainer,
  calendarNavigationButtonsContainer,
} from "./theme";

function RangeCalendar({ buttons, ...rest }: TRangeCalendarProps) {
  const { locale } = useLocale();
  const state = useRangeCalendarState({
    ...rest,
    locale,
    createCalendar,
  });

  const ref = useRef(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar({ ...rest }, state, ref);

  // Filter out isDisabled from calendarProps to avoid React warnings
  const { isDisabled: _calendarIsDisabled, ...filteredCalendarProps } =
    calendarProps;

  // Filter out isDisabled from button props to avoid React warnings
  const { isDisabled: _prevIsDisabled, ...filteredPrevButtonProps } =
    prevButtonProps;

  const { isDisabled: _nextIsDisabled, ...filteredNextButtonProps } =
    nextButtonProps;

  const containerTheme = calendarContainer();
  const headerTheme = calendarHeaderContainer();
  const navigationButtonsContainer = calendarNavigationButtonsContainer();

  return (
    <div {...filteredCalendarProps} ref={ref} className={containerTheme}>
      <div className={headerTheme}>
        <Text as="p" size="sm">
          {title}
        </Text>
        <div className={navigationButtonsContainer}>
          <Button
            iconOnly
            type="button"
            {...filteredPrevButtonProps}
            handlePress={() => prevButtonProps.onPress?.({} as never)}
          >
            <Icon name={buttons?.buttonPrev?.icon ?? "ArrowLeft"} />
          </Button>
          <Button
            iconOnly
            type="button"
            {...filteredNextButtonProps}
            handlePress={() => nextButtonProps.onPress?.({} as never)}
          >
            <Icon name={buttons?.buttonNext?.icon ?? "ArrowRight"} />
          </Button>
        </div>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}

export default RangeCalendar;
