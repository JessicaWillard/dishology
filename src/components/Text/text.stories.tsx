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
      <Text {...args} variant="body">Body</Text>
      <Text {...args} variant="muted">Muted</Text>
      <Text {...args} variant="danger">Danger</Text>
      <Text {...args} variant="success">Success</Text>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-2 w-[640px]">
      <Text {...args} size="xs">XS</Text>
      <Text {...args} size="sm">SM</Text>
      <Text {...args} size="md">MD</Text>
      <Text {...args} size="lg">LG</Text>
      <Text {...args} size="xl">XL</Text>
      <Text {...args} size="h1" as="h1">Heading 1</Text>
      <Text {...args} size="h2" as="h2">Heading 2</Text>
      <Text {...args} size="h3" as="h3">Heading 3</Text>
    </div>
  ),
};


