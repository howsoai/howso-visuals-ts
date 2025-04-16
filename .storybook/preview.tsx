import type { Preview } from "@storybook/react";
import { darkBackground, lightBackground } from "./constants";
// CSS
// import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    backgrounds: {
      // Load them by hand, or make a nice loop if you wish
      values: [lightBackground, darkBackground],
      // Ensure a default is set, so you avoid type errors reading from undefined!
      default: lightBackground.name,
      // Supports globals usage
      options: {
        [lightBackground.name]: lightBackground,
        [darkBackground.name]: darkBackground,
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    initialGlobals: {
      viewport: { value: undefined },
    },
  },
  tags: ["autodocs"],
};
export default preview;
