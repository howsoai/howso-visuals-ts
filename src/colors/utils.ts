import { ColorScale } from "plotly.js";
import { ColorShade, Discrete } from ".";
import tinycolor from "tinycolor2";

/** Returns the contrasting text color for a given color. White or Black */
export const getTextColor = (color: string) => {
  var tc = tinycolor(color);
  const brightness = tc.getBrightness();
  const luminance = tc.getLuminance();
  console.info({ brightness, luminance });

  // if (tc.getAlpha() !== 1) tc = tinycolor(combine(color, background));

  var newColor = tc.isDark() ? "#fff" : "#000";

  return newColor.toString();
};

export type GetColorSchemeParams = {
  isDark: boolean | undefined;
  isPrint: boolean | undefined;
};
export const getColorScheme = ({
  isDark,
  isPrint,
}: GetColorSchemeParams): "light" | "dark" =>
  isDark && !isPrint ? "dark" : "light";

export type GetDiscreteColorParams = GetColorSchemeParams & {
  index?: number;
};
/**
 * Returns a render context aware color from Discrete.
 * Indexes overflows from available colors will loop back around to the Discrete start.
 */
export const getDiscreteColor = (
  params: GetDiscreteColorParams
): ColorShade => {
  const scheme = getColorScheme(params);
  const modulus = !params.index ? 0 : params.index % Discrete[scheme].length;
  return Discrete[scheme][modulus];
};

export const getColorScale = (colors: ColorShade[]): ColorScale => {
  if (colors.length < 2) {
    throw new Error("At least two colors must be provided to make a scale");
  }

  const step = 1 / colors.length;
  // @ts-expect-error TODO Types are wrong https://plotly.com/javascript/reference/heatmap/#heatmap-colorscale
  return colors.map((color, index) => [
    index === colors.length - 1 ? 1 : step * index,
    color as string,
  ]);
};
