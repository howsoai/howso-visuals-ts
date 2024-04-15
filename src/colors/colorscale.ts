import { scaleValue } from "../utils";
import { ColorShade } from "./types";

export const getColorScaleShade = (
  value: number | null | undefined,
  params: {
    fromRange: { min: number; max: number };
    colorscale: [number, string][];
    colorScheme: "light" | "dark";
  }
): ColorShade => {
  const backgroundColor = params.colorScheme === "dark" ? "#000" : "#fff";
  if (value === null || value === undefined) {
    return backgroundColor;
  }

  // Transform the range into the colorscale
  const shadeValue = scaleValue(value, params.fromRange, { min: 0, max: 1 });
  const shade = params.colorscale.find(([number, color]) =>
    shadeValue <= number ? color : false
  );
  if (!shade?.[1]) {
    return backgroundColor;
  }
  return shade[1] as ColorShade;
};
