import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./index";

const meta: Meta<typeof Input> = {
  title: "Components/Fields/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible input component with support for labels, right-side icons, and validation states.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error"],
    },
    disabled: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    hideLabel: {
      control: "boolean",
    },
    rightIcon: {
      control: false, // Disable control for rightIcon to prevent serialization issues
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Enter text...",
  },
};

export const WithValue: Story = {
  args: {
    label: "Label",
    value: "Input value",
  },
};

export const Required: Story = {
  args: {
    label: "Required Field",
    placeholder: "This field is required",
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    helperText: "We'll never share your email with anyone else.",
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    error: true,
    errorMessage: "Please enter a valid email address.",
    value: "invalid-email",
  },
};

export const WithSearchIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    rightIcon: "Search",
  },
};

export const WithCurrencyIcon: Story = {
  args: {
    label: "Amount",
    placeholder: "0.00",
    rightIcon: "Currency",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "This input is disabled",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Read Only",
    value: "This is read only",
    readOnly: true,
  },
};

export const InputVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <Input label="Standard Input" placeholder="Enter text..." />
      <Input
        label="With Icon"
        placeholder="Enter amount"
        rightIcon="Currency"
      />
      <Input
        label="Required Field"
        placeholder="This field is required"
        required
      />
    </div>
  ),
};

export const NoLabel: Story = {
  args: {
    placeholder: "Input without visible label",
    hideLabel: true,
    "aria-label": "Input without visible label",
  },
};

export const Kitchen: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      <Input
        label="Recipe Name"
        placeholder="Enter recipe name"
        rightIcon="Recipe"
      />
      <Input
        label="Ingredients"
        placeholder="Add ingredients"
        rightIcon="Ingredient"
      />
      <Input label="Cost per serving" placeholder="0.00" rightIcon="Currency" />
      <Input
        label="Email"
        placeholder="chef@restaurant.com"
        error={true}
        errorMessage="This email is already in use."
        value="chef@invalid"
      />
    </div>
  ),
};
