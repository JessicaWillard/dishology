import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SupplierCard } from ".";

const meta: Meta<typeof SupplierCard> = {
  title: "Components/SupplierCard",
  component: SupplierCard,
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
    supplierName: {
      control: { type: "text" },
      description: "The name of the supplier business",
    },
    description: {
      control: { type: "text" },
      description: "A brief description of the supplier",
    },
    contactName: {
      control: { type: "text" },
      description: "The name of the primary contact person",
    },
    email: {
      control: { type: "text" },
      description: "Contact email address",
    },
    phone: {
      control: { type: "text" },
      description: "Contact phone number",
    },
    website: {
      control: { type: "text" },
      description: "Supplier website URL",
    },
  },
  args: {
    supplierName: "Supplier Name",
    description: "Description of the supplier",
    contactName: "Contact name",
    email: "info@example.com",
    phone: "555-555-5555",
    website: "suppliers.com",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    supplierName: "Premium Organic Ingredients Supply Co.",
    description:
      "A comprehensive supplier of high-quality organic ingredients sourced from sustainable farms across the Pacific Northwest",
    contactName: "Margaret Thompson-Williams",
    email: "margaret.thompson-williams@premiumorganic.com",
    phone: "+1 (555) 123-4567",
    website: "www.premiumorganicingredients.com",
  },
};

export const MinimalData: Story = {
  args: {
    supplierName: "ABC Foods",
    description: "Local food supplier",
    contactName: "John Doe",
    email: "john@abc.com",
    phone: "555-0123",
    website: "abc.com",
  },
};

export const WithNullValues: Story = {
  args: {
    supplierName: "Incomplete Supplier Info",
    description: null,
    contactName: "Jane Smith",
    email: null,
    phone: "555-9999",
    website: null,
  },
};

export const MultipleCards: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <SupplierCard
        {...args}
        supplierName="Fresh Produce Co."
        description="Organic fruits and vegetables"
        contactName="Alice Johnson"
        email="alice@freshproduce.com"
        phone="555-0001"
        website="freshproduce.com"
      />
      <SupplierCard
        {...args}
        supplierName="Dairy Delights"
        description="Premium dairy products"
        contactName="Bob Wilson"
        email="bob@dairydelights.com"
        phone="555-0002"
        website="dairydelights.com"
      />
      <SupplierCard
        {...args}
        supplierName="Spice World"
        description="International spices and seasonings"
        contactName="Carol Chen"
        email="carol@spiceworld.com"
        phone="555-0003"
        website="spiceworld.com"
      />
      <SupplierCard
        {...args}
        supplierName="Meat Masters"
        description="Quality meat products"
        contactName="Dave Rodriguez"
        email="dave@meatmasters.com"
        phone="555-0004"
        website="meatmasters.com"
      />
    </div>
  ),
};
