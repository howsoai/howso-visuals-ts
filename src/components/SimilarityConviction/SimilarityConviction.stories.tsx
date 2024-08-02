import type { Meta, StoryObj } from "@storybook/react";
import { isDarkBackground } from "../../../.storybook/utils";
import { SimilarityConviction } from "./SimilarityConviction";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof SimilarityConviction> = {
  component: SimilarityConviction,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    style: {
      height: "90vh",
      width: "90vw",
      // overflow: "hidden",
    },
  },
  render: (args, context) => {
    return (
      <SimilarityConviction {...args} isDark={isDarkBackground(context)} />
    );
  },
};

export default meta;
type Story = StoryObj<typeof SimilarityConviction>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    cases: new Array(30).fill(0).map((_, index) => ({
      ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
      ".session_training_index": index,
      similarity_conviction: (index % 2 === 0 ? 2 : 1) + (index % 3),
    })),
  },
};
