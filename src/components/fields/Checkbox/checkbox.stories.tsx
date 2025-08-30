import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Checkbox } from "./index";
import type { CheckboxProps } from "./interface";

// Template for interactive stories
const Template = (args: CheckboxProps) => {
  const [checked, setChecked] = useState(
    args.checked || args.defaultChecked || false
  );

  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(newChecked, event) => {
        setChecked(newChecked);
        args.onChange?.(newChecked, event);
      }}
    />
  );
};

const meta: Meta<typeof Checkbox> = {
  title: "Components/Fields/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible checkbox component with support for labels, descriptions, and validation. Also includes a CheckboxGroup for managing multiple checkboxes.",
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

    checked: {
      control: "boolean",
    },
    onChange: {
      action: "changed",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: Template,
  args: {
    label: "Accept terms and conditions",
  },
};

export const WithDescription: Story = {
  render: Template,
  args: {
    label: "Send me email notifications",
    description: "Get notified about new recipes and cooking tips",
  },
};

export const Required: Story = {
  render: Template,
  args: {
    label: "Required checkbox",
    required: true,
    description: "This field is required to proceed",
  },
};

export const Error: Story = {
  render: Template,
  args: {
    label: "Accept privacy policy",
    error: true,
    errorMessage: "You must accept the privacy policy to continue",
    description: "Required to create your account",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled option",
    disabled: true,
    description: "This option is not available",
  },
};
