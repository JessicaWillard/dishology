import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextArea } from "./index";

const meta: Meta<typeof TextArea> = {
  title: "Components/Fields/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible textarea component with support for labels, right-side icons, validation states, auto-expansion, and customizable resize behavior.",
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
    autoExpand: {
      control: "boolean",
    },
    resize: {
      control: "select",
      options: ["none", "both", "horizontal", "vertical"],
    },
    rows: {
      control: "number",
      min: 1,
      max: 20,
    },
    rightIcon: {
      control: false, // Disable control for rightIcon to prevent serialization issues
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description...",
  },
};

export const WithValue: Story = {
  args: {
    label: "Recipe Instructions",
    value:
      "Preheat oven to 350°F. Mix all ingredients in a large bowl. Bake for 25-30 minutes until golden brown.",
  },
};

export const Required: Story = {
  args: {
    label: "Required Comments",
    placeholder: "This field is required",
    required: true,
    rows: 3,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Feedback",
    placeholder: "Share your thoughts...",
    helperText: "Your feedback helps us improve our recipes.",
    rows: 4,
  },
};

export const Error: Story = {
  args: {
    label: "Recipe Notes",
    placeholder: "Add your notes...",
    error: true,
    errorMessage: "Please provide at least 10 characters.",
    value: "Too short",
    rows: 3,
  },
};

export const AutoExpanding: Story = {
  args: {
    label: "Auto-expanding TextArea",
    placeholder: "Start typing and watch me grow...",
    autoExpand: true,
    rows: 2,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled TextArea",
    placeholder: "This textarea is disabled",
    disabled: true,
    rows: 3,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: "TextArea without visible label",
    hideLabel: true,
    "aria-label": "TextArea without visible label",
    rows: 4,
  },
};

export const Kitchen: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <TextArea
        label="Recipe Instructions"
        placeholder="Provide step-by-step cooking instructions..."
        rightIcon="Recipe"
        rows={6}
        helperText="Include prep time, cooking time, and detailed steps."
      />
      <TextArea
        label="Ingredient Notes"
        placeholder="Special notes about ingredients..."
        rightIcon="Ingredient"
        rows={4}
      />
      <TextArea
        label="Chef's Comments"
        placeholder="Additional tips and suggestions..."
        autoExpand
        rows={3}
        helperText="Share your professional insights and tips."
      />
      <TextArea
        label="Feedback"
        placeholder="Customer feedback..."
        error={true}
        errorMessage="Feedback must be at least 20 characters long."
        value="Too brief"
        rows={4}
      />
    </div>
  ),
};
