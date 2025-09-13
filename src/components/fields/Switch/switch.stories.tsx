import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "./index";
import { useState } from "react";

const meta: Meta<typeof Switch> = {
  title: "Components/Fields/Switch",
  component: Switch,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "error"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    readOnly: {
      control: { type: "boolean" },
    },
    required: {
      control: { type: "boolean" },
    },
    error: {
      control: { type: "boolean" },
    },
    hideLabel: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: "Enable notifications",
    description: "Receive email notifications about updates",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Dark mode",
    description: "Switch between light and dark themes",
  },
};

export const Required: Story = {
  args: {
    label: "Accept terms and conditions",
    description: "You must accept to continue",
    required: true,
  },
};

export const Error: Story = {
  args: {
    label: "Enable two-factor authentication",
    description: "Add an extra layer of security to your account",
    error: true,
    errorMessage: "This field is required for security purposes",
  },
};

export const Disabled: Story = {
  args: {
    label: "Premium feature",
    description: "This feature is only available for premium users",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: "System setting",
    description: "This setting is managed by the system administrator",
    readOnly: true,
    isSelected: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    hideLabel: true,
    "aria-label": "Toggle dark mode",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [isSelected, setIsSelected] = useState(false);

    return (
      <div className="space-y-4">
        <Switch {...args} isSelected={isSelected} onChange={setIsSelected} />
        <p className="text-sm text-gray-600">
          Current state: {isSelected ? "On" : "Off"}
        </p>
      </div>
    );
  },
  args: {
    label: "Controlled switch",
    description: "This switch is controlled by React state",
  },
};

export const MultipleSwitches: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [analytics, setAnalytics] = useState(true);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>
        <Switch
          label="Email notifications"
          description="Receive updates via email"
          isSelected={notifications}
          onChange={setNotifications}
        />
        <Switch
          label="Dark mode"
          description="Use dark theme"
          isSelected={darkMode}
          onChange={setDarkMode}
        />
        <Switch
          label="Analytics tracking"
          description="Help us improve by sharing usage data"
          isSelected={analytics}
          onChange={setAnalytics}
        />
      </div>
    );
  },
};
