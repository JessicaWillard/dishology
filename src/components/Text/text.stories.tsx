import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from ".";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  parameters: { layout: "centered" },
  args: { children: "The quick brown fox jumps over the lazy dog." },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-2 w-[640px]">
      <Text {...args} variant="body">
        Body
      </Text>
      <Text {...args} variant="muted">
        Muted
      </Text>
      <Text {...args} variant="danger">
        Danger
      </Text>
      <Text {...args} variant="success">
        Success
      </Text>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-2 w-[640px]">
      <Text {...args} size="xs">
        Lorem ipsum dolor sit amet.
      </Text>
      <Text {...args} size="sm">
        Lorem ipsum dolor sit amet.
      </Text>
      <Text {...args} size="md">
        Lorem ipsum dolor sit amet.
      </Text>
      <Text {...args} size="lg" as="h3">
        Lorem ipsum dolor sit amet.
      </Text>
      <Text {...args} size="xl" as="h2">
        Lorem ipsum dolor sit amet.
      </Text>
      <Text {...args} size="2xl" as="h1">
        Lorem ipsum dolor sit amet.
      </Text>
    </div>
  ),
};
