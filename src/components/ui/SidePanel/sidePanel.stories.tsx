import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SidePanel } from "./index";
import { Button } from "../Button";
import { Text } from "../Text";
import { Box } from "../Box";

const meta: Meta<typeof SidePanel> = {
  title: "Components/SidePanel",
  component: SidePanel,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isOpen: {
      control: "boolean",
    },
    width: {
      control: "select",
      options: ["half", "full"],
    },
    position: {
      control: "select",
      options: ["left", "right"],
    },
    showOverlay: {
      control: "boolean",
    },
    closeOnOverlayClick: {
      control: "boolean",
    },
    closeOnEscape: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SidePanel>;

const SidePanelWithState = (
  args: Omit<React.ComponentProps<typeof SidePanel>, "isOpen" | "onClose">
) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <Button handlePress={() => setIsOpen(true)}>Open Side Panel</Button>

      <SidePanel {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Box display="flexCol" gap="md">
          <Text size="lg" weight="bold">
            Side Panel Content
          </Text>
          <Text>
            This is the content area of the side panel. You can put any content
            here.
          </Text>
          <Box display="flexCol" gap="sm">
            <Text weight="medium">Features:</Text>
            <Text>• Smooth slide animation</Text>
            <Text>• Overlay background</Text>
            <Text>• Close on escape key</Text>
            <Text>• Close on overlay click</Text>
            <Text>• Responsive width options</Text>
            <Text>• Left or right positioning</Text>
          </Box>
          <Button
            variant="outline"
            handlePress={() => setIsOpen(false)}
            className="mt-4"
          >
            Close Panel
          </Button>
        </Box>
      </SidePanel>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SidePanelWithState {...args} />,
  args: {
    width: "half",
    position: "right",
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
};

export const LeftPosition: Story = {
  render: (args) => <SidePanelWithState {...args} />,
  args: {
    width: "half",
    position: "left",
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
};

export const FullWidth: Story = {
  render: (args) => <SidePanelWithState {...args} />,
  args: {
    width: "full",
    position: "right",
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
};

export const WithoutOverlay: Story = {
  render: (args) => <SidePanelWithState {...args} />,
  args: {
    width: "half",
    position: "right",
    showOverlay: false,
    closeOnOverlayClick: false,
    closeOnEscape: true,
  },
};

export const NoOverlayClick: Story = {
  render: (args) => <SidePanelWithState {...args} />,
  args: {
    width: "half",
    position: "right",
    showOverlay: true,
    closeOnOverlayClick: false,
    closeOnEscape: true,
  },
};
