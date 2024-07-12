import type { Meta, StoryObj } from "@storybook/react";
import { UMAPVisual, UMAPVisualProps } from "./UMAPVisual";
import { isDarkBackground } from "../../../.storybook/utils";
import { Iris, irisData, irisDistances } from "@/data/iris";
import colorsVectors from "./data/color-vectors.json";
import { getUMAPKNNParamsFromHowsoTraineeDistances } from "./utils";
import { geoPath } from "d3";
import { DiscreteColorway } from "@/colors";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof UMAPVisual> = {
  component: UMAPVisual,
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
    return <UMAPVisual {...args} isDark={isDarkBackground(context)} />;
  },
};

type Color = [number, number, number, number];
export default meta;
type ColorStory = StoryObj<typeof UMAPVisual<Color>>;

const colorRenderer: UMAPVisualProps<Color>["render"] = ({
  context,
  coordinates,
  datum,
}) => {
  const path = geoPath().context(context);
  context.beginPath();
  path({ type: "Point", coordinates });
  context.fillStyle = `rgba(${[
    datum[0] * 255,
    datum[1] * 255,
    datum[2] * 255,
    0.5 + 0.5 * datum[3],
  ]})`;
  context.fill();
};

export const Vectors: ColorStory = {
  args: {
    data: colorsVectors,
    render: colorRenderer,
  },
};

export const VectorsStepModulus: ColorStory = {
  args: {
    data: colorsVectors,
    stepModulus: 5,
  },
};

const irisRenderer: UMAPVisualProps<Iris>["render"] = ({
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

type IrisStory = StoryObj<typeof UMAPVisual<Iris>>;

export const KNN: IrisStory = {
  args: {
    ...getUMAPKNNParamsFromHowsoTraineeDistances(irisDistances),
    data: irisData,
    params: {
      nNeighbors: 21,
      minDist: 0.3973857486219096,
    },
    render: irisRenderer,
  },
};

export const Loading: ColorStory = {
  args: {
    isLoading: true,
    data: undefined,
    render: colorRenderer,
  },
};

export const NoData: ColorStory = {
  args: {
    isLoading: false,
    data: undefined,
    render: colorRenderer,
  },
};
