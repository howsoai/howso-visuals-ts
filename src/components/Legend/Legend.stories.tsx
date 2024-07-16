import type { Meta, StoryObj } from "@storybook/react";
import { Legend } from "./Legend";
import { FC } from "react";
import fingerPrintIcon from "./assets/finger-prints-svgrepo-com.svg";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Legend> = {
  component: Legend,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  // tags: ["autodocs"], // This would be a really terrible idea given the load of each
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {},
  render: (args) => (
    <div style={{ maxWidth: "20ch" }}>
      <Legend {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof Legend>;

type CircleProps = {
  backgroundColor: string;
};
const Circle: FC<CircleProps> = ({ backgroundColor }) => (
  <div
    style={{
      borderRadius: "50%",
      height: ".75lh",
      width: ".75lh",
      backgroundColor,
    }}
  />
);

type RectangleProps = {
  backgroundColor: string;
};
const Rectangle: FC<RectangleProps> = ({ backgroundColor }) => (
  <div
    style={{
      height: ".1lh",
      width: "3rem",
      backgroundColor,
    }}
  />
);

const FingerPrintIcon: FC = () => (
  <img
    src={fingerPrintIcon}
    alt="Finger print"
    style={{ display: "block", height: ".75lh" }}
  />
);

export const Default: Story = {
  args: {
    items: [
      { visual: <Rectangle backgroundColor="red" />, label: "Item 1" },
      {
        visual: <Circle backgroundColor="rgb(0, 255, 0)" />,
        label:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus tempora, doloremque veritatis eligendi, ipsam possimus voluptate nulla dignissimos consectetur rerum",
      },
      { visual: <FingerPrintIcon />, label: "Item 1" },
    ],
  },
};
