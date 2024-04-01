import React from "react";
import type { Preview } from "@storybook/react";
// CSS
// import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";

const light = {
  name: "Light",
  value: "#fff",
};

const dark = {
  name: "Dark",
  value: "#000",
};

const preview: Preview = {
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    // layout: "fullscreen", // TODO not having any effect..
    backgrounds: {
      // Load them by hand, or make a nice loop if you wish
      values: [light, dark],
      // Ensure a default is set, so you avoid type errors reading from undefined!
      default: light.name,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: { defaultViewport: "responsive" },
  },
};
export default preview;
