import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InventoryTable } from "./InventoryTable";
import { CalendarDate } from "@internationalized/date";

const meta: Meta<typeof InventoryTable> = {
  title: "Components/InventoryTable",
  component: InventoryTable,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "default",
        "produce",
        "dry",
        "meat",
        "dairy",
        "beverage",
        "cleaning",
        "smallwares",
        "equipment",
        "other",
      ],
    },
    showHeader: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof InventoryTable>;

const sampleDate = new CalendarDate(2025, 7, 25);

export const Default: Story = {
  args: {
    id: "1",
    name: "Tomatoes",
    type: "produce",
    description: "Fresh organic tomatoes",
    quantity: "30",
    size: "1",
    unit: "kg",
    pricePerUnit: "1.50",
    pricePerPack: "15.00",
    supplier: "Fresh Farms",
    location: "Cooler A",
    minCount: "10",
    countDate: sampleDate,
    showHeader: true,
    compact: false,
  },
};

export const WithoutHeader: Story = {
  args: {
    ...Default.args,
    showHeader: false,
  },
};

export const LowStock: Story = {
  args: {
    ...Default.args,
    quantity: "5",
    minCount: "10",
  },
};

export const DifferentTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <InventoryTable
        id="1"
        type="produce"
        name="Apples"
        countDate={sampleDate}
        quantity="25"
        size="1"
        unit="kg"
        pricePerUnit="2.00"
        minCount="10"
      />
      <InventoryTable
        id="2"
        type="meat"
        name="Ground Beef"
        quantity="15"
        size="1"
        unit="lb"
        pricePerUnit="8.50"
        minCount="5"
        countDate={sampleDate}
      />
      <InventoryTable
        id="3"
        type="dairy"
        name="Milk"
        quantity="8"
        size="1"
        unit="gal"
        pricePerUnit="3.25"
        minCount="3"
        countDate={sampleDate}
      />
    </div>
  ),
};
