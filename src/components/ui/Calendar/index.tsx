"use client";

import { createCalendar } from "@internationalized/date";
import { useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { useRef } from "react";
import { Button } from "../Button";
import Icon from "../Icon";
import { Text } from "../Text";
import CalendarGrid from "./components/CalendarGrid";
import type { TCalendarProps } from "./interface";
import {
  calendarContainer,
  calendarHeaderContainer,
  calendarNavigationButtonsContainer,
} from "./theme";

const Calendar = ({ buttons, ...rest }: TCalendarProps) => {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...rest,
    locale,
    createCalendar,
  });

  const ref = useRef(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar({ ...rest }, state);

  // Filter out isDisabled from calendarProps to avoid React warnings
  const { isDisabled: _calendarIsDisabled, ...filteredCalendarProps } =
    calendarProps;

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
            isDisabled={prevButtonProps.isDisabled}
            handlePress={() => prevButtonProps.onPress?.({} as never)}
          >
            <Icon name={buttons?.buttonPrev?.icon ?? "ArrowLeft"} />
          </Button>
          <Button
            iconOnly
            type="button"
            isDisabled={nextButtonProps.isDisabled}
            handlePress={() => nextButtonProps.onPress?.({} as never)}
          >
            <Icon name={buttons?.buttonNext?.icon ?? "ArrowRight"} />
          </Button>
        </div>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
};

Calendar.displayName = "Calendar";

export default Calendar;
