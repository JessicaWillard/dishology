import RangeCalendar from "./RangeCalendar";
import Calendar from ".";

const CalendarTemplate = (args) => <Calendar {...args} />;
const RangeCalendarTemplate = (args) => <RangeCalendar {...args} />;

export default {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  args: {},
};

export const CalendarStory = {
  render: CalendarTemplate.bind({}),
  name: "Calendar",
};

export const RangeCalendarStory = {
  render: RangeCalendarTemplate.bind({}),
  name: "Range Calendar",
};
