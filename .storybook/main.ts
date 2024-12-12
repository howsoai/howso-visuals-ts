import type { StorybookConfig } from "@storybook/react-vite";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/addon-mdx-gfm"
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {},

  //👈 Configures the static asset folder in Storybook
  staticDirs: ["../public"],

  features: {
    viewportStoryGlobals: true,
  },

  refs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
