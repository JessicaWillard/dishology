import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "./index";
import type { NavBarProps } from "./interface";

const meta: Meta<typeof NavBar> = {
  title: "UI/NavBar",
  component: NavBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A bottom navigation bar component for mobile-first navigation between main sections.",
      },
    },
  },
  argTypes: {
    activeItemId: {
      control: "select",
      options: ["dashboard", "inventory", "recipes", "dishes", "planning"],
      description: "The currently active navigation item",
    },
    onItemClick: {
      action: "item clicked",
      description: "Callback fired when a navigation item is clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {},
};

export const WithActiveItem: Story = {
  args: {
    activeItemId: "inventory",
  },
};

export const CustomItems: Story = {
  args: {
    items: [
      {
        id: "home",
        label: "Home",
        icon: "Dashboard",
      },
      {
        id: "search",
        label: "Search",
        icon: "Search",
      },
      {
        id: "favorites",
        label: "Favorites",
        icon: "Check",
      },
    ],
    activeItemId: "search",
  },
};

export const WithCustomStyling: Story = {
  args: {
    activeItemId: "recipes",
    className: "bg-gray-50 border-gray-300",
  },
};

export const Interactive: Story = {
  args: {
    activeItemId: "dashboard",
  },
  render: (args: NavBarProps) => {
    const [activeItem, setActiveItem] = React.useState(args.activeItemId);

    return (
      <div className="h-screen bg-gray-100">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Interactive NavBar</h2>
          <p className="text-gray-600 mb-4">
            Click on different navigation items to see the active state change.
          </p>
          <p className="text-sm text-gray-500">
            Current active item: <strong>{activeItem}</strong>
          </p>
        </div>
        <NavBar
          {...args}
          activeItemId={activeItem}
          onItemClick={(itemId) => setActiveItem(itemId)}
        />
      </div>
    );
  },
};
