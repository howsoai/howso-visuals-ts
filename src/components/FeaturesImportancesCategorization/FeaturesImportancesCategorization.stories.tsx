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
        owns_house: 0.07300520600993982,
        customer_id: 0,
        occupation_type: 0.15044392607578705,
        default_in_last_6months: 0.27197087952864696,
        credit_limit: 0.1260375243676402,
        migrant_worker: 0.03262882385654411,
        no_of_children: 0.03544274765990585,
        no_of_days_employed: 0.13455594866871806,
        owns_car: 0.0929510372405258,
        credit_limit_used_percent: 0.08914727414662238,
        credit_score: 1,
        age: 0.14437659407288414,
        yearly_debt_payments: 0.13278910803636185,
        gender: 0.06618186840716067,
        net_yearly_income: 0.1366705971879801,
        total_family_members: 0.10078387284381209,
        name: 0.00940413231455159,
        prev_defaults: 0.34714082665328944,
      },
      scaled_ac: {
        owns_house: -0.0552553553856307,
        customer_id: 0.09966247812637669,
        occupation_type: -0.238054379173555,
        default_in_last_6months: 0.3865437325260459,
        credit_limit: 0.03984459160668875,
        migrant_worker: -0.08216432070333879,
        no_of_children: 0.10869909560214568,
        no_of_days_employed: 0.17007779084031174,
        owns_car: 0.14515598748624728,
        credit_limit_used_percent: 0.25799885836470227,
        credit_score: 1,
        age: 0.19344436613528213,
        yearly_debt_payments: 0.10116672104367336,
        gender: 0.1903201874283866,
        net_yearly_income: 0.32345268934715327,
        total_family_members: -0.015882319700862655,
        name: 0.06382889359368632,
        prev_defaults: 0.7093033390387026,
      },
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
