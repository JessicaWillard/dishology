import DateRangePicker from "./DateRangePicker";
import { DatePicker } from ".";
import type { TDatePickerProps, TDateRangePickerProps } from "./interface";
import type { DateValue } from "@internationalized/date";

const DatePickerTemplate = (args: TDatePickerProps) => (
  <div style={{ minHeight: "500px" }}>
    <DatePicker {...args} />
  </div>
);
const DateRangePickerTemplate = (args: TDateRangePickerProps) => (
  <div style={{ minHeight: "500px" }}>
    <DateRangePicker {...args} />
  </div>
);

export default {
  title: "Components/Fields/DatePicker",
  parameters: {
    layout: "centered",
  },
  component: DatePicker,

  args: {
    label: "Select date",
    onChange: (date: DateValue) => console.log(date),
  },
};

export const DateFieldAndIcon = {
  render: DatePickerTemplate.bind({}),
  name: "Date Picker",
};

export const DateRangePickerStory = {
  render: DateRangePickerTemplate.bind({}),

  name: "Date Range Picker",
};
