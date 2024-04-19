import type { Meta, StoryObj } from "@storybook/react";
import { FeatureCorrelations } from "./FeatureCorrelations";
import { isDarkBackground } from "../../../.storybook/utils";
import { Divergent2Colorway } from "../../colors";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof FeatureCorrelations> = {
  component: FeatureCorrelations,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    features: [
      "refrigerated|refrigerated meals",
      "candy and gum|gum",
      "frozen foods|frozen seafood",
      "baking|sugar",
      "condiments sauces and seasonings",
      "produce|fruits",
    ],
    formatParams: {
      replacements: "|",
    },
    correlations: [
      [1, null, 0.3, 0.5, 0.1, -0.5],
      [0.2, 1, 0.6, 0.8983749387493, 0.3, 0.2],
      [0.3, 0.6347938473, 1, -0.1, 0.2, 0],
      [0.2, 0.1, 0.6, 1, 0.3, 0.8],
      [0.2, 0.1, 0.6, -0.88364837438463, 1, -0.1],
      [0.2, 0.4, 0.3, -0.8836, 0.3, 1],
    ],
    style: {
      height: "90vh",
      width: "90vw",
      // overflow: "hidden",
    },
  },
  render: (args, context) => {
    return <FeatureCorrelations {...args} isDark={isDarkBackground(context)} />;
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCorrelations>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {},
};

export const DefinedColors: Story = {
  args: {
    colors: Divergent2Colorway,
  },
};
