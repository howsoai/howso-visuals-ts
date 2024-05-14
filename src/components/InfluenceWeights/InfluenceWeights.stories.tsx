import type { Meta, StoryObj } from "@storybook/react";
import { InfluenceWeights } from "./InfluenceWeights";
import { isDarkBackground } from "../../../.storybook/utils";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof InfluenceWeights> = {
  component: InfluenceWeights,
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
    featureX: "age",
    featureY: "chol",
    idFeatures: ["age", "chol"],
    influenceCases: [
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        chol: 264,
        thal: 2,
        exang: 0,
        ".session_training_index": 298,
        age: 45,
        sex: 1,
        cp: 1,
        thalach: 132,
        ".influence_weight": 0.5645133348066479,
        fbs: 0,
        ca: 0,
        slope: 2,
        ecg: 0,
        trestbps: 110,
        class: 1,
        oldpeak: 1.2,
      },
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        chol: 219,
        thal: 2,
        exang: 0,
        ".session_training_index": 109,
        age: 39,
        sex: 1,
        cp: 4,
        thalach: 140,
        ".influence_weight": 0.26548661040784065,
        fbs: 0,
        ca: 0,
        slope: 2,
        ecg: 0,
        trestbps: 118,
        class: 1,
        oldpeak: 1.2,
      },
      {
        ".session": "b83205cf-bc84-453e-bb6e-472c151c6a62",
        chol: 239,
        thal: 2,
        exang: 0,
        ".session_training_index": 152,
        age: 47,
        sex: 1,
        cp: 4,
        thalach: 140,
        ".influence_weight": 0.9548661040784065,
        fbs: 0,
        ca: 0,
        slope: 2,
        ecg: 0,
        trestbps: 118,
        class: 1,
        oldpeak: 1.2,
      },
    ],
    predictionCase: {
      age: 50,
      sex: 1,
      cp: 1,
      trestbps: 130,
      chol: 262,
      fbs: 0,
      ecg: 0,
      thalach: 140,
      exang: 0,
      oldpeak: 1.5,
      slope: 2,
      ca: 0,
      thal: 2,
      class: 1,
    },
  },
  render: (args, context) => {
    return <InfluenceWeights {...args} isDark={isDarkBackground(context)} />;
  },
};

export default meta;
type Story = StoryObj<typeof InfluenceWeights>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {},
};
