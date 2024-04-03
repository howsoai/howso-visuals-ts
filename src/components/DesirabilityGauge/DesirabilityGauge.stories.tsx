import type { Meta, StoryObj } from "@storybook/react";
import { DesirabilityGauge } from "./DesirabilityGauge";
import { Orange, Pink } from "../../colors";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof DesirabilityGauge> = {
  component: DesirabilityGauge,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    value: 4,
    label: "Desirability",
    style: {
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    },
  },
  render: (args, context) => (
    <DesirabilityGauge
      {...args}
      isDark={
        !["transparent", "#fff"].includes(context.globals.backgrounds?.value)
      }
    />
  ),
};

export default meta;
type Story = StoryObj<typeof DesirabilityGauge>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {},
};

export const PinkStory: Story = {
  name: "Pink",
  args: {
    color: Pink.dark[900],
    divider: Orange.dark[400],
  },
};

export const StyleSizing: Story = {
  args: {
    layout: {
      margin: { t: 24, b: 6, l: 42, r: 42 },
    },
    style: {
      position: "relative",
      display: "inline-block",
      width: "20rem",
      height: "10rem",
    },
  },
};

export const LayoutProps: Story = {
  args: {
    layout: {
      margin: { t: 24, b: 6, l: 42, r: 42 },
      width: 300,
      height: 200,
    },
    style: {
      width: "auto",
      height: "auto",
    },
  },
};