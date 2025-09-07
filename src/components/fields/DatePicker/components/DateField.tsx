import type { DateValue } from "@internationalized/date";
import { createCalendar } from "@internationalized/date";
import type { AriaDatePickerProps } from "react-aria";
import { useDateField, useDateSegment, useLocale } from "react-aria";
import { useDateFieldState } from "react-stately";
import { useRef } from "react";
import { FocusRing } from "react-aria";
import type { TDateSegmentProps } from "../interface";
import { datePickerDateSegment } from "../../theme";
function DateSegment({ segment, state }: TDateSegmentProps) {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  // Filter out isDisabled from segmentProps to avoid React warnings
  const { isDisabled: _segmentIsDisabled, ...filteredSegmentProps } =
    segmentProps;

  return (
    <FocusRing focusRingClass="has-focus-ring">
      <div
        {...filteredSegmentProps}
        ref={ref}
        className={datePickerDateSegment()}
      >
        {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
        <span
          aria-hidden="true"
          style={{
            visibility: segment.isPlaceholder ? "visible" : "hidden",
            height: segment.isPlaceholder ? "" : 0,
            pointerEvents: "none",
            display: segment.isPlaceholder ? "block" : "none",
          }}
        >
          {segment.placeholder}
        </span>
        {segment.isPlaceholder ? "" : segment.text}
      </div>
    </FocusRing>
  );
}

function DateField(props: AriaDatePickerProps<DateValue>) {
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef(null);
  const { fieldProps } = useDateField(props, state, ref);

  // Filter out isDisabled from fieldProps to avoid React warnings
  const { isDisabled: _fieldIsDisabled, ...filteredFieldProps } = fieldProps;

  return (
    <div {...filteredFieldProps} ref={ref} className="flex">
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}

export default DateField;
