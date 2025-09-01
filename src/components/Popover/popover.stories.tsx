import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef, useState } from "react";
import { Popover } from ".";
import { Button } from "../Button";
import { PopoverPlacement, PopoverProps } from "./interface";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A popover component that positions content relative to a trigger element.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story wrapper component to handle state and refs
const PopoverDemo = ({
  placement = "bottom",
  children,
  ...props
}: Omit<PopoverProps, "isOpen" | "onOpenChange" | "triggerRef"> & {
  placement?: PopoverPlacement;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="p-8">
      <Button
        ref={triggerRef}
        handlePress={() => setIsOpen(!isOpen)}
        variant="outline"
        className="relative"
      >
        {isOpen ? "Close" : "Open"} Popover
      </Button>

      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        triggerRef={triggerRef as React.RefObject<Element>}
        placement={placement}
        {...props}
      >
        {children || (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Popover Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              This is a popover with some example content. It can contain any
              React elements.
            </p>
            <Button handlePress={() => setIsOpen(false)}>Close</Button>
          </div>
        )}
      </Popover>
    </div>
  );
};

export const Default: Story = {
  // eslint-disable-next-line react/no-children-prop
  render: () => <PopoverDemo placement={"bottom"} children={undefined} />,
};

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-16">
      <PopoverDemo placement="top">
        <div className="p-3 text-sm">Top</div>
      </PopoverDemo>
      <PopoverDemo placement="left">
        <div className="p-3 text-sm">Left</div>
      </PopoverDemo>
      <PopoverDemo placement="bottom">
        <div className="p-3 text-sm">Bottom (Default)</div>
      </PopoverDemo>
      <PopoverDemo placement="right">
        <div className="p-3 text-sm">Right</div>
      </PopoverDemo>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};

export const WithComplexContent: Story = {
  render: () => (
    // eslint-disable-next-line react/no-children-prop
    <PopoverDemo placement={"bottom"}>
      <div className="p-4 w-80">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            J
          </div>
          <div>
            <h4 className="font-semibold">Jessica Willard</h4>
            <p className="text-sm text-gray-600">Product Designer</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          This popover contains more complex content including avatars, multiple
          text elements, and actions.
        </p>

        <div className="flex gap-2">
          <Button variant="outline">View Profile</Button>
          <Button>Send Message</Button>
        </div>
      </div>
    </PopoverDemo>
  ),
};
