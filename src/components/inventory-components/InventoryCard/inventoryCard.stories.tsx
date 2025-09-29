import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InventoryCard } from ".";
import { CalendarDate } from "@internationalized/date";

const meta: Meta<typeof InventoryCard> = {
  title: "Components/InventoryCard",
  component: InventoryCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A card component for displaying supplier information including contact details and business information.",
      },
    },
  },
  argTypes: {
    name: {
      control: { type: "text" },
      description: "The name of the inventory item",
    },
    type: {
      control: {
        type: "select",
        options: [
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
      description: "The type of the inventory item",
    },
    description: {
      control: { type: "text" },
      description: "A brief description of the inventory item",
    },
    supplier: {
      control: { type: "text" },
      description: "The name of the supplier",
    },
    quantity: {
      control: { type: "number" },
      description: "Quantity",
    },
    size: {
      control: { type: "number" },
      description: "Size",
    },
    unit: {
      control: { type: "text" },
      description: "Unit",
    },
    pricePerUnit: {
      control: { type: "number" },
      description: "Price per unit",
    },
    pricePerPack: {
      control: { type: "number" },
      description: "Price per pack",
    },
    countDate: {
      control: { type: "text" },
      description: "Count date",
    },
    minCount: {
      control: { type: "number" },
      description: "Minimum count",
    },
  },
  args: {
    name: "Inventory Name",
    description: "Description of the inventory item",
    supplier: {
      id: "1",
      name: "Supplier Name",
      contact: {
        contactName: "Contact Name",
        email: "contact@example.com",
        phone: "123-456-7890",
        website: "example.com",
      },
    },
    quantity: "10",
    size: "10",
    unit: "kg",
    pricePerUnit: "10",
    pricePerPack: "10",
    countDate: new CalendarDate(2025, 1, 1).toString(),
    minCount: "5",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// export const MultipleCards: Story = {
//   render: (args) => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
//       <InventoryCard
//         {...args}
//         supplierName="Fresh Produce Co."
//         description="Organic fruits and vegetables"
//         contactName="Alice Johnson"
//         email="alice@freshproduce.com"
//         phone="555-0001"
//         website="freshproduce.com"
//       />
//       <SupplierCard
//         {...args}
//         supplierName="Dairy Delights"
//         description="Premium dairy products"
//         contactName="Bob Wilson"
//         email="bob@dairydelights.com"
//         phone="555-0002"
//         website="dairydelights.com"
//       />
//       <SupplierCard
//         {...args}
//         supplierName="Spice World"
//         description="International spices and seasonings"
//         contactName="Carol Chen"
//         email="carol@spiceworld.com"
//         phone="555-0003"
//         website="spiceworld.com"
//       />
//       <SupplierCard
//         {...args}
//         supplierName="Meat Masters"
//         description="Quality meat products"
//         contactName="Dave Rodriguez"
//         email="dave@meatmasters.com"
//         phone="555-0004"
//         website="meatmasters.com"
//       />
//     </div>
//   ),
// };
