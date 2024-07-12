import type { Meta, StoryObj } from "@storybook/react";
import { UMAP2D, UMAP2DProps } from "./UMAP2D";
import { isDarkBackground } from "../../../.storybook/utils";
import { Iris, irisData, irisPositions } from "@/data/iris";
import { geoPath } from "d3";
import { DiscreteColorway } from "@/colors";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof UMAP2D> = {
  component: UMAP2D,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  // tags: ["autodocs"], // This would be a really terrible idea given the load of each
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    style: {
      height: "100vh",
      width: "100vw",
      // overflow: "hidden",
    },
  },
  render: (args, context) => {
    return <UMAP2D {...args} isDark={isDarkBackground(context)} />;
  },
};
export default meta;

const irisRenderer: UMAP2DProps<Iris>["render"] = ({
  context,
  coordinates,
  datum,
}) => {
  const path = geoPath().context(context);
  context.beginPath();
  path({ type: "Point", coordinates });
  context.fillStyle = DiscreteColorway[datum.target];
  context.fill();
};

type Story = StoryObj<typeof UMAP2D<Iris>>;

export const Default: Story = {
  args: {
    positions: irisPositions,
    data: irisData,
    render: irisRenderer,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    data: undefined,
    render: irisRenderer,
  },
};

export const NoData: Story = {
  args: {
    isLoading: false,
    data: undefined,
    render: irisRenderer,
  },
};
