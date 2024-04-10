import type { Meta, StoryObj } from "@storybook/react";
import { FeatureContributionsVerticalBarChart } from "./FeatureContributionsVerticalBarChart";
import { Pink } from "../../../colors";
import { isDarkBackground } from "../../../../.storybook/utils";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof FeatureContributionsVerticalBarChart> = {
  component: FeatureContributionsVerticalBarChart,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    features: {
      "refrigerated|refrigerated meals": 0.00808881005772587,
      "candy and gum|gum": 0.003783146753826595,
      "frozen foods|frozen seafood": 0.006987351747868633,
      "baking|sugar": 0.007866823992963809,
      "condiments sauces and seasonings": 0.003538466207906794,
      "produce|fruits": 0.00440856930186572,
      "beverages|water": 0.003010419294373369,
      "dairy|milk": 0.00392660483410862,
      bakery: 0.002157902359502204,
      "snacks cookies and chips|popcorn": 0.004450267202378963,
      "candy and gum|mints": 0.005880315095911488,
      "meat seafood and poultry|beef": 0.0031460412388450323,
      beverages: 0.0035441871465917802,
      "wine|rose": 0.006285415092270254,
      "condiments sauces and seasonings|seasoning": 0.0021923860519170277,
      "produce|vegetables": 0.0047682859894070916,
      "candy and gum": 0.008647303549027732,
      "deli|deli meat": 0.0035133903532245593,
      baking: 0.005941285693457634,
      "spirits|rum": 0.0019161666612034383,
      "canned goods and soups|meat and poultry": 0.0037683550240014334,
      "meat seafood and poultry|seafood": 0.007678122646303344,
      "beverages|sports and energy drinks": 0.004035655259937735,
      "dairy|cheese": 0.0048677306675795114,
      "snacks cookies and chips": 0.004873706095546737,
      "candy and gum|gummy and chewy": 0.002480212683140545,
      "frozen foods|pizza": 0.005208273607988813,
      beer: 0.0033027363628432027,
      wine: 0.0007389917986071854,
      "condiments sauces and seasonings|condiments": 0.0048152073646825075,
      "produce|nuts": 0.007063465104414912,
      "boxed meals": 0.0031431346168092162,
      "dairy|yogurt": 0.005278159324482991,
      "bakery|bread": 0.002868267138224954,
      spirits: 0.0022901676838112386,
      "canned goods and soups": 0.00406289376940833,
      "meat seafood and poultry|pork": 0.0032557372392556625,
      "beverages|coffee": 0.0035249249091217423,
      dairy: 0.006148131325445861,
      refrigerated: 0.008100174890504488,
      "candy and gum|chocolate": 0.0027431715133000387,
      "frozen foods": 0.004297593514721246,
      "baking|mixes": 0.003837894957044625,
      "spirits|whisky": 0.0014776294770580784,
      "canned goods and soups|soups": 0.0014786691691421766,
      produce: 0.004306399451364139,
      "beverages|tea": 0.0023782793102882387,
      "snacks cookies and chips|cookies": 0.002411066597613255,
      "candy and gum|hard candy and lollipops": 0.005369148082436802,
      "meat seafood and poultry": 0.006163089963723611,
      "beer|craft/import beer": 0.0029296468792999763,
      "wine|red": 0.0031022133276607682,
      "condiments sauces and seasonings|sauces": 0.003913181048881803,
      "produce|potatoes": 0.004873794976014443,
      "boxed meals|instant meals": 0.003173330506888152,
      deli: 0.0028132036694548572,
      "bakery|desserts": 0.0016971097496831,
      "spirits|gin": 0.0014608093073935602,
      "canned goods and soups|canned vegetables": 0.0024254721117696653,
      "meat seafood and poultry|poultry": 0.003813282365736059,
      "beverages|juice": 0.0035308895965803755,
      "dairy|butter": 0.004481506729847437,
    },
    style: {
      height: "90vh",
      width: "90vw",
      // overflow: "hidden",
    },
  },
  render: (args, context) => {
    console.info("backgrounds", context.globals.backgrounds);
    return (
      <FeatureContributionsVerticalBarChart
        {...args}
        isDark={isDarkBackground(context)}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof FeatureContributionsVerticalBarChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Default: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {},
};

export const DefinedColor: Story = {
  args: {
    color: Pink.dark[900],
  },
};

export const Unlimited: Story = {
  args: {
    limit: 0,
  },
};
