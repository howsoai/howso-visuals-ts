import type { Meta, StoryObj } from "@storybook/react";
import { isDarkBackground } from "../../../.storybook/utils";
import { FeaturesImportancesCategorization } from "./FeaturesImportancesCategorization";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof FeaturesImportancesCategorization> = {
  component: FeaturesImportancesCategorization,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    style: {
      // overflow: "hidden",
    },
    data: {
      scaled_pc: {
        "0": 0.07134418791364801,
        "1": 0.04167790119306914,
        "2": 0.09748957179494218,
        "3": 1.0,
        "4": 0.3206256641141031,
        "5": 0.0,
        "6": 0.1965102591154175,
        "7": 0.08005823749283214,
        "8": 0.07975276260388896,
        "9": 0.05436554307862072,
        "10": 0.12517812958958693,
        "11": 0.11051721758264872,
        "12": 0.10593783465480598,
        "13": 0.22556813142162366,
        "14": 0.06614646590493911,
        "15": 0.09699387661372208,
        "16": 0.24433374518921772,
        "17": 0.0051564266166623145,
      },
      scaled_ac: {
        "0": 0.4899589055531733,
        "1": -0.11287704799095748,
        "2": 1.0,
        "3": 0.7208926120030578,
        "4": 0.31615810082971435,
        "5": 0.10920538677971557,
        "6": 0.3115794104558283,
        "7": 0.6722291427408086,
        "8": 0.2479155259868729,
        "9": 0.05465133608900417,
        "10": 0.037798233682027234,
        "11": -0.1903360695216733,
        "12": -0.1830100354297876,
        "13": -0.12386939343138867,
        "14": -0.16196566173511026,
        "15": 0.22085410449295298,
        "16": -0.1385212633112876,
        "17": -0.23113370036229436,
      },
      columns: [
        "owns_car",
        "no_of_children",
        "total_family_members",
        "credit_score",
        "prev_defaults",
        "customer_id",
        "credit_limit_used_percent",
        "credit_limit",
        "age",
        "migrant_worker",
        "no_of_days_employed",
        "occupation_type",
        "net_yearly_income",
        "yearly_debt_payments",
        "owns_house",
        "gender",
        "default_in_last_6months",
        "name",
      ],
      action_feature: "credit_card_default",
    },
  },
  render: (args, context) => {
    return (
      <FeaturesImportancesCategorization
        {...args}
        isDark={isDarkBackground(context)}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof FeaturesImportancesCategorization>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {},
};

export const Loading: Story = {
  args: {
    isLoading: true,
    data: undefined,
  },
};
