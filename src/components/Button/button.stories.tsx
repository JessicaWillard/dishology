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
      options: ["solid", "outline", "ghost", "link"],
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "icon"],
    },
    radius: {
      control: { type: "select" },
      options: ["md", "lg", "full"],
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

export const Link: Story = {
  args: {
    variant: "link",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="xs">
        XS
      </Button>
      <Button {...args} size="sm">
        SM
      </Button>
      <Button {...args} size="md">
        MD
      </Button>
      <Button {...args} size="lg">
        LG
      </Button>
      <Button {...args} size="icon" aria-label="icon">
        <Icon name="Check" />
      </Button>
    </div>
  ),
};
