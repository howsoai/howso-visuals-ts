import type { Meta, StoryObj } from "@storybook/react";
import { isDarkBackground } from "../../../.storybook/utils";
import { FeatureImportances } from "./FeatureImportances";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof FeatureImportances> = {
  component: FeatureImportances,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    features: [
      "owns_house",
      "customer_id",
      "occupation_type",
      "default_in_last_6months",
      "credit_limit",
      "migrant_worker",
      "no_of_children",
      "no_of_days_employed",
      "owns_car",
      "credit_limit_used_percent",
      "credit_score",
      "age",
      "yearly_debt_payments",
      "gender",
      "net_yearly_income",
      "total_family_members",
      "name",
      "prev_defaults",
    ],
    style: {},
  },
  render: (args, context) => {
    return <FeatureImportances {...args} isDark={isDarkBackground(context)} />;
  },
};

export default meta;
type Story = StoryObj<typeof FeatureImportances>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Predictions: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    metric: "prediction_contributions",
    data: {
      owns_house: {
        feature_robust_prediction_contributions: 0.014811650686059934,
      },
      customer_id: {
        feature_robust_prediction_contributions: 0.00890084702837318,
      },
      default_in_last_6months: {
        feature_robust_prediction_contributions: 0.02095851835339205,
      },
      occupation_type: {
        feature_robust_prediction_contributions: 0.01761959668940342,
      },
      credit_limit: {
        feature_robust_prediction_contributions: 0.016720876588323726,
      },
      migrant_worker: {
        feature_robust_prediction_contributions: 0.010787902873717968,
      },
      no_of_children: {
        feature_robust_prediction_contributions: 0.011199264802496136,
      },
      no_of_days_employed: {
        feature_robust_prediction_contributions: 0.0170820696061112,
      },
      owns_car: {
        feature_robust_prediction_contributions: 0.013831178814956773,
      },
      credit_limit_used_percent: {
        feature_robust_prediction_contributions: 0.016020989017521057,
      },
      credit_score: {
        feature_robust_prediction_contributions: 0.06407630533637847,
      },
      age: {
        feature_robust_prediction_contributions: 0.017043441684548945,
      },
      yearly_debt_payments: {
        feature_robust_prediction_contributions: 0.0170697927554791,
      },
      net_yearly_income: {
        feature_robust_prediction_contributions: 0.01724261933482424,
      },
      gender: {
        feature_robust_prediction_contributions: 0.014278832231877401,
      },
      total_family_members: {
        feature_robust_prediction_contributions: 0.014989886066746895,
      },
      name: {
        feature_robust_prediction_contributions: 0.010919598733250513,
      },
      prev_defaults: {
        feature_robust_prediction_contributions: 0.028639298088859597,
      },
    },
  },
};

export const Accuracy: Story = {
  args: {
    metric: "accuracy_contributions",
    data: {
      owns_house: {
        feature_robust_accuracy_contributions: -0.014182250111246048,
      },
      customer_id: {
        feature_robust_accuracy_contributions: -0.014347961690128447,
      },
      occupation_type: {
        feature_robust_accuracy_contributions: -0.008244912646762331,
      },
      default_in_last_6months: {
        feature_robust_accuracy_contributions: 0.03232940915975563,
      },
      credit_limit: {
        feature_robust_accuracy_contributions: -0.010355735458613069,
      },
      migrant_worker: {
        feature_robust_accuracy_contributions: -0.01577451667343921,
      },
      no_of_children: {
        feature_robust_accuracy_contributions: -0.008792703496801196,
      },
      no_of_days_employed: {
        feature_robust_accuracy_contributions: 0.001149631111611843,
      },
      owns_car: {
        feature_robust_accuracy_contributions: -0.0008577958787918116,
      },
      credit_limit_used_percent: {
        feature_robust_accuracy_contributions: 0.008051435313734562,
      },
      credit_score: {
        feature_robust_accuracy_contributions: 0.05513960640759741,
      },
      age: {
        feature_robust_accuracy_contributions: 0.016246785913285655,
      },
      yearly_debt_payments: {
        feature_robust_accuracy_contributions: 0.002085713042523585,
      },
      gender: {
        feature_robust_accuracy_contributions: -0.001043178403955597,
      },
      net_yearly_income: {
        feature_robust_accuracy_contributions: -0.01932977400844904,
      },
      total_family_members: {
        feature_robust_accuracy_contributions: -0.013094089712505141,
      },
      name: {
        feature_robust_accuracy_contributions: 0.012605880536346453,
      },
      prev_defaults: {
        feature_robust_accuracy_contributions: 0.04915561328897114,
      },
    },
  },
};

export const Loading: Story = {
  args: {
    metric: "prediction_contributions",
    isLoading: true,
    data: undefined,
  },
};
