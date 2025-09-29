import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InventoryTable } from ".";
import { CalendarDate } from "@internationalized/date";

const meta: Meta<typeof InventoryTable> = {
  title: "Components/InventoryTable",
  component: InventoryTable,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    showHeader: {
      control: "boolean",
    },
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
        "mixed",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InventoryTable>;

const sampleDate = new CalendarDate(2025, 7, 25).toString();

const sampleItems = [
  {
    id: "1",
    name: "Tomatoes",
    type: "produce" as const,
    description: "Fresh organic tomatoes",
    quantity: "30",
    size: "1",
    unit: "kg",
    pricePerUnit: "1.50",
    pricePerPack: "15.00",
    supplier: {
      id: "supplier-1",
      name: "Fresh Farms",
      contact: {
        contactName: "John Doe",
        phone: "555-0123",
        email: "john@freshfarms.com",
        website: "freshfarms.com",
      },
    },
    location: "Cooler A",
    minCount: "10",
    countDate: sampleDate,
  },
  {
    id: "2",
    name: "Ground Beef",
    type: "meat" as const,
    quantity: "15",
    size: "1",
    unit: "lb",
    pricePerUnit: "8.50",
    minCount: "5",
    countDate: sampleDate,
  },
  {
    id: "3",
    name: "Milk",
    type: "dairy" as const,
    quantity: "8",
    size: "1",
    unit: "gal",
    pricePerUnit: "3.25",
    minCount: "3",
    countDate: sampleDate,
  },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    showHeader: true,
  },
};

export const WithoutHeader: Story = {
  args: {
    items: sampleItems,
    showHeader: false,
  },
};

export const LowStock: Story = {
  args: {
    items: [
      {
        ...sampleItems[0],
        quantity: "5",
        minCount: "10",
      },
      ...sampleItems.slice(1),
    ],
    showHeader: true,
  },
};

export const SingleItem: Story = {
  args: {
    items: [sampleItems[0]],
    showHeader: true,
  },
};

export const EmptyTable: Story = {
  args: {
    items: [],
    showHeader: true,
  },
};

// Stories demonstrating type-based header styling
export const AllProduceItems: Story = {
  args: {
    items: sampleItems.filter((item) => item.type === "produce"),
    showHeader: true,
  },
};

export const AllMeatItems: Story = {
  args: {
    items: sampleItems.filter((item) => item.type === "meat"),
    showHeader: true,
  },
};

export const MixedTypes: Story = {
  args: {
    items: sampleItems,
    showHeader: true,
  },
};

export const ExplicitMixedType: Story = {
  args: {
    items: sampleItems,
    type: "mixed",
    showHeader: true,
  },
};

export const ExplicitProduceType: Story = {
  args: {
    items: sampleItems,
    type: "produce",
    showHeader: true,
  },
};
