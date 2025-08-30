import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { CheckboxGroup } from "./index";
import type { CheckboxGroupProps } from "./interface";

// Template for interactive stories
const Template = (args: CheckboxGroupProps) => {
  const [value, setValue] = useState<string[]>(args.value || []);

  return (
    <CheckboxGroup
      {...args}
      value={value}
      onChange={(newValue, event) => {
        setValue(newValue);
        args.onChange?.(newValue, event);
      }}
    />
  );
};

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/Fields/CheckboxGroup",
  component: CheckboxGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A group of checkboxes with shared validation and layout options.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "error"],
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    onChange: {
      action: "changed",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  render: Template,
  args: {
    label: "Select your preferences",
    items: [
      { id: "1", label: "Email notifications", value: "email" },
      { id: "2", label: "SMS notifications", value: "sms" },
      { id: "3", label: "Push notifications", value: "push" },
    ],
  },
};

export const Horizontal: Story = {
  render: Template,
  args: {
    label: "Meal types",
    orientation: "horizontal",
    items: [
      { id: "1", label: "Breakfast", value: "breakfast" },
      { id: "2", label: "Lunch", value: "lunch" },
      { id: "3", label: "Dinner", value: "dinner" },
      { id: "4", label: "Snacks", value: "snacks" },
    ],
  },
};

export const WithDescriptions: Story = {
  render: Template,
  args: {
    label: "Dietary preferences",
    description: "Select all that apply to your dietary needs",
    items: [
      {
        id: "1",
        label: "Vegetarian",
        value: "vegetarian",
        description: "No meat products",
      },
      {
        id: "2",
        label: "Vegan",
        value: "vegan",
        description: "No animal products",
      },
      {
        id: "3",
        label: "Gluten-free",
        value: "gluten-free",
        description: "No gluten-containing ingredients",
      },
      {
        id: "4",
        label: "Dairy-free",
        value: "dairy-free",
        description: "No dairy products",
        disabled: true,
      },
    ],
  },
};

export const Error: Story = {
  render: Template,
  args: {
    label: "Required selections",
    required: true,
    error: true,
    errorMessage: "Please select at least one option",
    items: [
      { id: "1", label: "Option A", value: "a" },
      { id: "2", label: "Option B", value: "b" },
      { id: "3", label: "Option C", value: "c" },
    ],
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    label: "Disabled group",
    disabled: true,
    helperText: "These options are currently unavailable",
    items: [
      { id: "1", label: "Option A", value: "a" },
      { id: "2", label: "Option B", value: "b" },
      { id: "3", label: "Option C", value: "c" },
    ],
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedValues, setSelectedValues] = useState<string[]>(["lunch"]);

    return (
      <CheckboxGroup
        label="Interactive group"
        description="Select your favorite meals"
        value={selectedValues}
        onChange={setSelectedValues}
        items={[
          {
            id: "1",
            label: "Breakfast",
            value: "breakfast",
            description: "Start your day right",
          },
          {
            id: "2",
            label: "Lunch",
            value: "lunch",
            description: "Midday fuel",
          },
          {
            id: "3",
            label: "Dinner",
            value: "dinner",
            description: "Evening feast",
          },
          {
            id: "4",
            label: "Late night snack",
            value: "snack",
            description: "Midnight cravings",
          },
        ]}
        helperText={`Selected: ${selectedValues.join(", ") || "none"}`}
      />
    );
  },
};

export const KitchenScenario: Story = {
  render: () => {
    const [preferences, setPreferences] = useState<string[]>(["notifications"]);
    const [restrictions, setRestrictions] = useState<string[]>([]);

    return (
      <div className="space-y-8 max-w-lg">
        <CheckboxGroup
          label="Kitchen Preferences"
          description="Customize your kitchen management experience"
          value={preferences}
          onChange={setPreferences}
          items={[
            {
              id: "1",
              label: "Email notifications",
              value: "notifications",
              description:
                "Get notified about low stock and expiring ingredients",
            },
            {
              id: "2",
              label: "Auto-generate shopping lists",
              value: "auto-shopping",
              description:
                "Automatically create shopping lists based on recipes",
            },
            {
              id: "3",
              label: "Recipe suggestions",
              value: "suggestions",
              description: "Receive personalized recipe recommendations",
            },
          ]}
        />

        <CheckboxGroup
          label="Dietary Restrictions"
          description="Help us suggest appropriate recipes"
          orientation="horizontal"
          value={restrictions}
          onChange={setRestrictions}
          items={[
            { id: "1", label: "Vegetarian", value: "vegetarian" },
            { id: "2", label: "Vegan", value: "vegan" },
            { id: "3", label: "Gluten-Free", value: "gluten-free" },
            { id: "4", label: "Dairy-Free", value: "dairy-free" },
            { id: "5", label: "Nut-Free", value: "nut-free" },
          ]}
        />
      </div>
    );
  },
};
