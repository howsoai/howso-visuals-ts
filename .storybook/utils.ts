import { StoryContext } from "@storybook/react";
import { darkBackground } from "./constants";

export const isDarkBackground = (context: StoryContext<any>): boolean =>
  context.globals?.backgrounds?.value === darkBackground.value;
