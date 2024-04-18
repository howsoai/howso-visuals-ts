import { Colorway, DiscreteColorway, NamedColor } from ".";
import tinycolor from "tinycolor2";
import { getSemanticColors } from "../hooks";

/** Returns the contrasting semantic text color for a given color. */
export const getContrastingTextColor = (color: string) => {
  var tc = tinycolor(color);
  // if (tc.getAlpha() !== 1) tc = tinycolor(combine(color, background));
  const semanticColors = getSemanticColors({
    colorScheme: tc.isDark() ? "dark" : "light",
  });
  return semanticColors.text.primary;
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
export const getDiscreteColor = (params: GetDiscreteColorParams): string => {
  const modulus = !params.index ? 0 : params.index % DiscreteColorway.length;
  return DiscreteColorway[modulus];
};

export const getColorScale = (colors: string[]): [number, string][] => {
  if (colors.length < 2) {
    throw new Error("At least two colors must be provided to make a scale");
  }

  const step = 1 / colors.length;
  return colors.map((color, index) => [
    index === colors.length - 1 ? 1 : step * index,
    color as string,
  ]);
};

export const buildColorWay = (namedColor: NamedColor) => {
  namedColor.colorway = [
    namedColor["900"],
    namedColor["800"],
    namedColor["700"],
    namedColor["600"],
    namedColor["500"],
    namedColor["400"],
    namedColor["300"],
    namedColor["200"],
    namedColor["100"],
  ];
};

export const buildDiscreteColorWay = (namedColors: NamedColor[]) => {
  const shades = ["900", "700", "500", "300"];
  return shades.reduce((colorway, shade) => {
    return namedColors.reduce((colorway, color) => {
      // @ts-expect-error
      colorway.push(color[shade]);
      return colorway;
    }, colorway);
  }, [] as Colorway);
};
