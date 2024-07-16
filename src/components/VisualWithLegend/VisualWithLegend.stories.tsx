import type { Meta, StoryObj } from "@storybook/react";
import { VisualWithLegend } from "./VisualWithLegend";
import { Legend } from "../Legend";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof VisualWithLegend> = {
  component: VisualWithLegend,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  // tags: ["autodocs"], // This would be a really terrible idea given the load of each
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    children: <div style={{ background: "teal", height: "12rem" }} />,
  },
};
export default meta;

type Story = StoryObj<typeof VisualWithLegend>;

export const Default: Story = {
  args: {
    legend: (
      <Legend
        items={[
          {
            visual: <Legend.Line style={{ backgroundColor: "red" }} />,
            label: "Item 1",
          },
          {
            visual: (
              <Legend.Circle style={{ backgroundColor: "rgb(0, 255, 0)" }} />
            ),
            label: "Item 2",
          },
        ]}
      />
    ),
  },
};

export const LongLabel: Story = {
  args: {
    legend: (
      <Legend
        items={[
          {
            visual: <Legend.Line style={{ backgroundColor: "red" }} />,
            label: "Item 1",
          },
          {
            visual: (
              <Legend.Circle style={{ backgroundColor: "rgb(0, 255, 0)" }} />
            ),
            label:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus tempora, doloremque veritatis eligendi, ipsam possimus voluptate nulla dignissimos consectetur rerum",
          },
        ]}
      />
    ),
  },
};
