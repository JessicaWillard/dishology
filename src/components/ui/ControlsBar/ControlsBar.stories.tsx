import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ControlsBar } from "./index";

const meta: Meta<typeof ControlsBar> = {
  title: "UI/ControlsBar",
  component: ControlsBar,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    search: {
      control: false,
    },
    viewToggle: {
      control: false,
    },
    primaryAction: {
      control: false,
    },
    secondaryActions: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ControlsBar>;

// Basic example with just primary action (like suppliers page)
export const Basic: Story = {
  args: {
    primaryAction: {
      onPress: () => console.log("Add clicked"),
      icon: "Plus",
      label: "Add item",
    },
  },
};

// Full featured example (like inventory page)
export const FullFeatured: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<"card" | "table">("table");
    const [searchTerm, setSearchTerm] = useState("");

    return (
      <ControlsBar
        search={{
          placeholder: "Search inventory...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
        }}
        viewToggle={{
          currentView: viewMode,
          onToggle: () => setViewMode(viewMode === "card" ? "table" : "card"),
        }}
        primaryAction={{
          onPress: () => console.log("Add clicked"),
          icon: "Plus",
          label: "Add inventory item",
        }}
        secondaryActions={[
          {
            onPress: () => console.log("Filter clicked"),
            icon: "Filter",
            label: "Filter inventory",
            variant: "ghost",
          },
        ]}
      />
    );
  },
};

// With search only
export const SearchOnly: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
      <ControlsBar
        search={{
          placeholder: "Search...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
        }}
      />
    );
  },
};

// With primary action and search
export const WithSearch: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
      <ControlsBar
        search={{
          placeholder: "Search items...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
        }}
        primaryAction={{
          onPress: () => console.log("Add clicked"),
          icon: "Plus",
          label: "Add item",
        }}
      />
    );
  },
};

// With multiple secondary actions
export const MultipleActions: Story = {
  args: {
    primaryAction: {
      onPress: () => console.log("Add clicked"),
      icon: "Plus",
      label: "Add item",
    },
    secondaryActions: [
      {
        onPress: () => console.log("Filter clicked"),
        icon: "Filter",
        label: "Filter",
        variant: "ghost",
      },
      {
        onPress: () => console.log("Export clicked"),
        icon: "Download",
        label: "Export",
        variant: "ghost",
      },
      {
        onPress: () => console.log("Settings clicked"),
        icon: "Settings",
        label: "Settings",
        variant: "ghost",
      },
    ],
  },
};
