import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from ".";
import { fn } from "storybook/test";
import { Icon } from "@/components/Icon";

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

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args}>X</Button>
      <Button {...args}>SM</Button>
      <Button {...args}>MD</Button>
      <Button {...args}>LG</Button>
      <Button {...args} iconOnly={true}>
        <Icon name="Warning" />
      </Button>
    </div>
  ),
};
