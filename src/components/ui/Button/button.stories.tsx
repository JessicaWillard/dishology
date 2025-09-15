import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from ".";
import { fn } from "storybook/test";
import { Icon } from "@/components/ui/Icon";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  // Using MDX docs, so we do not enable autodocs here to avoid duplication
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
    },
    iconOnly: {
      control: { type: "boolean" },
    },
  },
  args: { children: "Button", handlePress: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    variant: "solid",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Tag: Story = {
  args: {
    variant: "tag",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} variant="nav">
        <Icon name="Dashboard" />
        Dashboard
      </Button>
      <Button {...args} variant="nav">
        <Icon name="Ingredient" />
        Inventory
      </Button>
      <Button {...args} variant="nav">
        <Icon name="Recipe" />
        Recipes
      </Button>
      <Button {...args} variant="nav">
        <Icon name="Dish" />
        Dishes
      </Button>
      <Button {...args} variant="nav">
        <Icon name="Calendar" />
        Planning
      </Button>
    </div>
  ),
};
