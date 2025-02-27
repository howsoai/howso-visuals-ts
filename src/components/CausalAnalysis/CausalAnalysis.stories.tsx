import type { Meta, StoryObj } from "@storybook/react";
import { isDarkBackground } from "../../../.storybook/utils";
import { CausalAnalysis } from "./CausalAnalysis";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof CausalAnalysis> = {
  component: CausalAnalysis,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    style: { width: "100%" },
  },
  render: (args, context) => {
    return <CausalAnalysis {...args} isDark={isDarkBackground(context)} />;
  },
};

export default meta;
type Story = StoryObj<typeof CausalAnalysis>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const PredictabilityDrivers: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    metric: "prediction_contributions",
    data: {
      Source: {
        0: "prev_defaults",
        1: "default_in_last_6months",
        2: "credit_card_default",
        3: "no_of_children",
        4: "no_of_days_employed",
        5: "no_of_children",
      },
      Destination: {
        0: "credit_score",
        1: "credit_score",
        2: "credit_score",
        3: "total_family_members",
        4: "occupation_type",
        5: "credit_score",
      },
      Delta: {
        0: 0.1446322693075714,
        1: 0.13494030872676124,
        2: 0.10897009957095456,
        3: 0.08923138286193147,
        4: 0.0546399568894096,
        5: 0.04419471243281522,
      },
    },
  },
};

export const PredictabilityDriversLoading: Story = {
  args: {
    metric: "prediction_contributions",
    data: undefined,
    isLoading: true,
  },
};

export const UncertaintyDrivers: Story = {
  args: {
    metric: "accuracy_contributions",
    data: {
      Source: {
        "0": "prev_defaults",
        "1": "default_in_last_6months",
        "2": "prev_defaults",
        "3": "owns_house",
        "4": "credit_card_default",
        "5": "yearly_debt_payments",
        "6": "prev_defaults",
        "7": "owns_house",
        "8": "total_family_members",
        "9": "prev_defaults",
        "10": "default_in_last_6months",
        "11": "credit_card_default",
        "12": "name",
        "13": "net_yearly_income",
        "14": "net_yearly_income",
        "15": "credit_limit_used_percent",
        "16": "owns_house",
        "17": "migrant_worker",
        "18": "credit_score",
        "19": "migrant_worker",
        "20": "occupation_type",
        "21": "owns_car",
        "22": "gender",
        "23": "total_family_members",
        "24": "age",
        "25": "no_of_days_employed",
        "26": "customer_id",
        "27": "yearly_debt_payments",
        "28": "name",
        "29": "yearly_debt_payments",
        "30": "no_of_children",
        "31": "age",
        "32": "credit_card_default",
        "33": "credit_card_default",
        "34": "prev_defaults",
        "35": "credit_card_default",
        "36": "credit_card_default",
        "37": "customer_id",
        "38": "total_family_members",
        "39": "default_in_last_6months",
        "40": "credit_card_default",
        "41": "credit_card_default",
        "42": "owns_car",
        "43": "no_of_children",
        "44": "credit_card_default",
        "45": "credit_card_default",
        "46": "prev_defaults",
        "47": "no_of_days_employed",
        "48": "net_yearly_income",
        "49": "default_in_last_6months",
        "50": "no_of_days_employed",
        "51": "credit_card_default",
        "52": "migrant_worker",
        "53": "gender",
        "54": "prev_defaults",
        "55": "no_of_children",
        "56": "gender",
        "57": "default_in_last_6months",
        "58": "credit_card_default",
        "59": "owns_car",
        "60": "credit_limit_used_percent",
        "61": "credit_limit_used_percent",
        "62": "net_yearly_income",
        "63": "occupation_type",
        "64": "migrant_worker",
        "65": "credit_score",
        "66": "credit_card_default",
        "67": "owns_house",
        "68": "name",
        "69": "credit_score",
        "70": "owns_car",
        "71": "yearly_debt_payments",
        "72": "owns_house",
        "73": "name",
        "74": "owns_car",
      },
      Destination: {
        "0": "credit_score",
        "1": "credit_score",
        "2": "credit_limit",
        "3": "default_in_last_6months",
        "4": "credit_score",
        "5": "default_in_last_6months",
        "6": "no_of_children",
        "7": "prev_defaults",
        "8": "prev_defaults",
        "9": "name",
        "10": "credit_card_default",
        "11": "credit_limit",
        "12": "default_in_last_6months",
        "13": "prev_defaults",
        "14": "credit_limit",
        "15": "credit_limit",
        "16": "credit_limit",
        "17": "credit_limit",
        "18": "credit_limit",
        "19": "default_in_last_6months",
        "20": "credit_limit",
        "21": "credit_limit",
        "22": "credit_limit",
        "23": "credit_limit",
        "24": "credit_limit",
        "25": "credit_limit",
        "26": "credit_limit",
        "27": "prev_defaults",
        "28": "credit_limit",
        "29": "credit_limit",
        "30": "credit_limit",
        "31": "default_in_last_6months",
        "32": "occupation_type",
        "33": "gender",
        "34": "credit_limit_used_percent",
        "35": "no_of_children",
        "36": "credit_limit_used_percent",
        "37": "prev_defaults",
        "38": "default_in_last_6months",
        "39": "credit_limit",
        "40": "customer_id",
        "41": "owns_house",
        "42": "default_in_last_6months",
        "43": "default_in_last_6months",
        "44": "net_yearly_income",
        "45": "age",
        "46": "credit_card_default",
        "47": "occupation_type",
        "48": "credit_score",
        "49": "customer_id",
        "50": "migrant_worker",
        "51": "total_family_members",
        "52": "prev_defaults",
        "53": "occupation_type",
        "54": "owns_car",
        "55": "total_family_members",
        "56": "default_in_last_6months",
        "57": "prev_defaults",
        "58": "migrant_worker",
        "59": "no_of_children",
        "60": "default_in_last_6months",
        "61": "migrant_worker",
        "62": "default_in_last_6months",
        "63": "default_in_last_6months",
        "64": "occupation_type",
        "65": "no_of_children",
        "66": "owns_car",
        "67": "no_of_children",
        "68": "owns_house",
        "69": "total_family_members",
        "70": "migrant_worker",
        "71": "no_of_days_employed",
        "72": "net_yearly_income",
        "73": "migrant_worker",
        "74": "owns_house",
      },
      Delta: {
        "0": 2.0018104332429343,
        "1": 1.44932649422475,
        "2": 1.1227806719433207,
        "3": 1.003848870607539,
        "4": 0.8507716935337111,
        "5": 0.8150356893451101,
        "6": 0.8136359702664736,
        "7": 0.6863511201625976,
        "8": 0.6243959503970247,
        "9": 0.5743585746725535,
        "10": 0.5649896460002615,
        "11": 0.46827201434360377,
        "12": 0.4678545742464607,
        "13": 0.4378218114493927,
        "14": 0.35327499068947044,
        "15": 0.3429887333084039,
        "16": 0.33719090052516687,
        "17": 0.33138929516269533,
        "18": 0.3283842447514069,
        "19": 0.32792897552528216,
        "20": 0.3275860172269438,
        "21": 0.3236977194599949,
        "22": 0.319283126577166,
        "23": 0.3149162252147849,
        "24": 0.3120283780261897,
        "25": 0.30225036699458824,
        "26": 0.3012764300086257,
        "27": 0.29365210975565836,
        "28": 0.28945697251737845,
        "29": 0.28796536568514863,
        "30": 0.28392305727185746,
        "31": 0.24473201584929996,
        "32": 0.21688836481792173,
        "33": 0.20573264961961613,
        "34": 0.19691850144228593,
        "35": 0.19532870512399222,
        "36": 0.18716170495351184,
        "37": 0.18483173472724335,
        "38": 0.16204915168894185,
        "39": 0.16031341448718464,
        "40": 0.15624512576555197,
        "41": 0.14771776680398585,
        "42": 0.14670149198117882,
        "43": 0.13120379641150784,
        "44": 0.12815343327474696,
        "45": 0.126700325057128,
        "46": 0.1254313007713913,
        "47": 0.12292989917083234,
        "48": 0.11787151802531366,
        "49": 0.11612255474907589,
        "50": 0.11395710730949841,
        "51": 0.11339059490269686,
        "52": 0.10745947682298487,
        "53": 0.09401379887566647,
        "54": 0.08737258207060462,
        "55": 0.0858305947696989,
        "56": 0.07920071724127262,
        "57": 0.07424694936753862,
        "58": 0.07255900082871711,
        "59": 0.07055708237429426,
        "60": 0.06883730332041023,
        "61": 0.06461465641186347,
        "62": 0.06381401516628682,
        "63": 0.060076464028227056,
        "64": 0.057463229557447884,
        "65": 0.05218637490422688,
        "66": 0.050961476152192986,
        "67": 0.04755419477309896,
        "68": 0.04640139738231375,
        "69": 0.04633176429396475,
        "70": 0.04417766694622476,
        "71": 0.042330966758470576,
        "72": 0.04220725675761507,
        "73": 0.04000048526381271,
        "74": 0.0383052166343267,
      },
    },
  },
};
