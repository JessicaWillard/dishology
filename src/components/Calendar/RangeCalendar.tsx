/* eslint-disable no-unused-vars */
import { createCalendar } from "@internationalized/date";
import { useRangeCalendar } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { useRangeCalendarState } from "@react-stately/calendar";
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

  const containerTheme = calendarContainer();
  const headerTheme = calendarHeaderContainer();
  const navigationButtonsContainer = calendarNavigationButtonsContainer();

  return (
    <div {...calendarProps} ref={ref} className={containerTheme}>
      <div className={headerTheme}>
        <Text as="p" size="sm">
          {title}
        </Text>
        <div className={navigationButtonsContainer}>
          <Button
            iconOnly
            type="button"
            {...prevButtonProps}
            handlePress={() => prevButtonProps.onPress?.({} as never)}
          >
            <Icon name={buttons?.buttonPrev?.icon ?? "ArrowLeft"} />
          </Button>
          <Button
            iconOnly
            type="button"
            {...nextButtonProps}
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
