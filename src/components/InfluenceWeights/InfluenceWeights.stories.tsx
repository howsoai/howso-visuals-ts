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
  },
  render: (args, context) => {
    return <InfluenceWeights {...args} isDark={isDarkBackground(context)} />;
  },
};

export default meta;
type Story = StoryObj<typeof InfluenceWeights>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const AgeAndCholesterol: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    featureX: "age",
    featureY: "chol",
    idFeatures: ["age", "chol", "class"],
    influenceCases: [
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        chol: 264,
        ".session_training_index": 298,
        age: 45,
        ".influence_weight": 0.5645133348066479,
        class: 1,
      },
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        chol: 219,
        ".session_training_index": 109,
        age: 39,
        ".influence_weight": 0.26548661040784065,
        class: 1,
      },
      {
        ".session": "b83205cf-bc84-453e-bb6e-472c151c6a62",
        chol: 239,
        ".session_training_index": 152,
        age: 47,
        ".influence_weight": 0.9548661040784065,
        class: 1,
      },
    ],
    predictionCase: {
      age: 50,
      chol: 262,
      class: 1,
    },
  },
};

export const MealAndBloodSugar: Story = {
  args: {
    featureX: "meal",
    featureY: "blood_sugar",
    idFeatures: ["meal", "blood_sugar", "class"],
    influenceCases: [
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        meal: "Steak and potatoes",
        ".session_training_index": 298,
        blood_sugar: 45,
        ".influence_weight": 0.5645133348066479,
        class: 1,
      },
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        meal: "Sushi",
        ".session_training_index": 109,
        blood_sugar: 39,
        ".influence_weight": 0.26548661040784065,
        class: 1,
      },
      {
        ".session": "b83205cf-bc84-453e-bb6e-472c151c6a62",
        meal: "Omelette du Fromage", // https://www.youtube.com/watch?v=2kArCRjT29w
        ".session_training_index": 152,
        blood_sugar: 47,
        ".influence_weight": 0.9548661040784065,
        class: 1,
      },
    ],
    predictionCase: {
      meal: "Grilled cheese",
      blood_sugar: 32,
      class: 1,
    },
  },
};
