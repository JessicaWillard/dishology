import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ComboBox } from "./index";
import type { ComboBoxItem } from "./interface";

const meta: Meta<typeof ComboBox> = {
  title: "Components/Fields/ComboBox",
  component: ComboBox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A ComboBox component built with React Aria that provides an accessible dropdown with filtering capabilities.

## Features
- **Accessible**: Built with React Aria for full keyboard navigation and screen reader support
- **Filterable**: Type to filter options in real-time
- **Customizable**: Supports custom values, icons, and validation states
- **Consistent**: Follows the same design patterns as other field components

## Usage
\`\`\`tsx
const items = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" }
];

<ComboBox
  label="Choose a fruit"
  items={items}
  onSelectionChange={(key) => console.log(key)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "error"],
      description: "Visual variant of the combobox",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the combobox is disabled",
    },
    readOnly: {
      control: { type: "boolean" },
      description: "Whether the combobox is read-only",
    },
    required: {
      control: { type: "boolean" },
      description: "Whether the combobox is required",
    },
    error: {
      control: { type: "boolean" },
      description: "Whether the combobox has an error state",
    },
    hideLabel: {
      control: { type: "boolean" },
      description: "Whether to hide the label visually",
    },
    allowsCustomValue: {
      control: { type: "boolean" },
      description: "Whether custom values are allowed",
    },
    menuTrigger: {
      control: { type: "select" },
      options: ["focus", "input", "manual"],
      description: "When to show the dropdown menu",
    },
    rightIcon: {
      control: { type: "text" },
      description: "Icon to show on the right side",
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

// Sample data
const fruitItems: ComboBoxItem[] = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
  { id: 4, name: "Date" },
  { id: 5, name: "Elderberry" },
  { id: 6, name: "Fig" },
  { id: 7, name: "Grape" },
  { id: 8, name: "Honeydew" },
];

const countryItems: ComboBoxItem[] = [
  { id: "us", name: "United States" },
  { id: "ca", name: "Canada" },
  { id: "mx", name: "Mexico" },
  { id: "uk", name: "United Kingdom" },
  { id: "fr", name: "France" },
  { id: "de", name: "Germany" },
  { id: "jp", name: "Japan" },
  { id: "au", name: "Australia" },
];

const ingredientItems: ComboBoxItem[] = [
  { id: 1, name: "Tomatoes", value: "tomatoes" },
  { id: 2, name: "Onions", value: "onions" },
  { id: 3, name: "Garlic", value: "garlic" },
  { id: 4, name: "Bell Peppers", value: "bell-peppers" },
  { id: 5, name: "Mushrooms", value: "mushrooms" },
  { id: 6, name: "Spinach", value: "spinach" },
];

// Default story
export const Default: Story = {
  args: {
    label: "Choose a fruit",
    placeholder: "Select or type to search...",
    items: fruitItems,
  },
};

// Error state
export const WithError: Story = {
  args: {
    label: "Country",
    placeholder: "Select your country...",
    items: countryItems,
    error: true,
    errorMessage: "Please select a valid country",
    required: true,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    label: "Disabled ComboBox",
    placeholder: "This is disabled",
    items: fruitItems,
    disabled: true,
    helperText: "This field is currently disabled",
  },
};

// With custom icon
export const WithIcon: Story = {
  args: {
    label: "Search ingredients",
    placeholder: "Search for ingredients...",
    items: ingredientItems,
    rightIcon: "Search",
    helperText: "Start typing to filter ingredients",
  },
};

// Hidden label
export const HiddenLabel: Story = {
  args: {
    label: "Hidden label ComboBox",
    placeholder: "The label is hidden but still accessible",
    items: fruitItems,
    hideLabel: true,
    "aria-label": "Choose a fruit",
  },
};

// Kitchen ingredient selector for the restaurant app
export const KitchenIngredients: Story = {
  render: (args) => {
    const [selectedIngredient, setSelectedIngredient] = useState<
      string | number | null
    >(null);

    return (
      <div className="w-96 space-y-4">
        <ComboBox
          {...args}
          selectedKey={selectedIngredient}
          onSelectionChange={(key) => {
            setSelectedIngredient(key);
          }}
        />

        {selectedIngredient && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Selected Ingredient:</h4>
            <div className="flex items-center gap-2">
              {(() => {
                const ingredient = ingredientItems.find(
                  (item) => String(item.id) === String(selectedIngredient)
                );
                return (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {ingredient?.name}
                  </span>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  },
  args: {
    label: "Add Recipe Ingredient",
    placeholder: "Search and select an ingredient...",
    items: ingredientItems,
    allowsCustomValue: true,
    helperText: "Type to search existing ingredients or add a new one",
  },
  parameters: {
    docs: {
      description: {
        story:
          "An example of how the ComboBox might be used in the restaurant app for selecting a single recipe ingredient.",
      },
    },
  },
};
