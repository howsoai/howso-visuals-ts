import { useMemo } from "react";
import { ChartColors, SemanticColors } from "../colors";

export const useSemanticColors = (
  params: UseSemanticColorsParams
): SemanticColors => {
  const semanticColors = useMemo(() => getSemanticColors(params), [params]);

  return semanticColors;
};

export type UseSemanticColorsParams = {
  colorScheme: "light" | "dark";
} & Partial<SemanticColors>;
/** A direct utility for getting defaults. For ease, you may prefer useSemanticColors. */
export const getSemanticColors = ({
  colorScheme,
  ...semanticColorsProps
}: UseSemanticColorsParams): SemanticColors => {
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
