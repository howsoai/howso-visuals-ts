import tinycolor from "tinycolor2";
import { ChartColors, DiscreteColorway } from "./named";
import { SemanticColors } from "./types";

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

export type SemanticColorsParams = {
  colorScheme: "light" | "dark";
} & Partial<SemanticColors>;
/** A direct utility for getting defaults. For ease, you may prefer useSemanticColors. */
export const getSemanticColors = ({
  colorScheme,
  ...semanticColorsProps
}: SemanticColorsParams): SemanticColors => {
  if (colorScheme === "dark") {
    return {
      primary: ChartColors.Blue[400],
      secondary: ChartColors.Gold[400],
      divider: ChartColors.Gray[300],
      background: {
        default: "#222",
        paper: "#374151",
        ...semanticColorsProps.background,
      },
      text: {
        primary: "#FFF",
        secondary: "#ddd",
        ...semanticColorsProps.text,
      },
      ...semanticColorsProps,
    };
  }

  return {
    primary: ChartColors.Blue[600],
    secondary: ChartColors.Gold[600],
    divider: ChartColors.Gray[700],
    background: {
      default: "#efefef",
      paper: "#fff",
      ...semanticColorsProps.background,
    },
    text: {
      primary: "#000",
      secondary: "#222",
      ...semanticColorsProps.text,
    },
    ...semanticColorsProps,
  };
};
