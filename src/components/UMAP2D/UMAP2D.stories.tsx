import type { Meta, StoryObj } from "@storybook/react";
import { geoPath } from "d3";
import { isDarkBackground } from "../../../.storybook/utils";
import { DiscreteColorway } from "../../colors";
import { Iris, irisData, irisPositions } from "../../data";
import { Legend } from "../Legend";
import { UMAP2D, type UMAP2DProps } from "./UMAP2D";

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

const IrisLegend = (
  <Legend
    items={[
      {
        visual: (
          <Legend.Circle style={{ backgroundColor: DiscreteColorway[0] }} />
        ),
        label: "Setosa",
      },
      {
        visual: (
          <Legend.Circle style={{ backgroundColor: DiscreteColorway[1] }} />
        ),
        label: "Versicolour",
      },
      {
        visual: (
          <Legend.Circle style={{ backgroundColor: DiscreteColorway[2] }} />
        ),
        label: "Virginica",
      },
    ]}
  />
);

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof UMAP2D<Iris>> = {
  component: UMAP2D,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  // tags: ["autodocs"], // This would be a really terrible idea given the load of each
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    style: {
      height: "100vh",
      // width: "100vw",
      // overflow: "hidden",
    },
    legend: IrisLegend,
    render: irisRenderer,
  },
  render: (args, context) => {
    return <UMAP2D {...args} isDark={isDarkBackground(context)} />;
  },
};
export default meta;

type Story = StoryObj<typeof UMAP2D<Iris>>;

export const Default: Story = {
  args: {
    positions: irisPositions,
    data: irisData,
  },
};

export const SetHeight: Story = {
  args: {
    positions: irisPositions,
    data: irisData,
    style: {
      height: "30rem",
      // width: "100vw",
      // overflow: "hidden",
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    data: undefined,
  },
};

export const NoData: Story = {
  args: {
    isLoading: false,
    data: undefined,
  },
};
