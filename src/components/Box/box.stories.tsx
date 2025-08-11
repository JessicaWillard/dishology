import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from ".";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
  parameters: { layout: "centered" },
  args: { children: "Content" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className="space-y-4 w-[320px]">
      <Box {...args} tone="default">Default</Box>
      <Box {...args} tone="muted">Muted</Box>
      <Box {...args} tone="contrast">Contrast</Box>
    </div>
  ),
};

export const Paddings: Story = {
  render: (args) => (
    <div className="space-y-4 w-[320px]">
      <Box {...args} padding="none">none</Box>
      <Box {...args} padding="sm">sm</Box>
      <Box {...args} padding="md">md</Box>
      <Box {...args} padding="lg">lg</Box>
    </div>
  ),
};


