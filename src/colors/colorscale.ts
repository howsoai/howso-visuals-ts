import { scaleValue } from "../utils";

export const getColorFromScale = (
  value: number | null | undefined,
  params: {
    fromRange: { min: number; max: number };
    colorscale: [number, string][];
    colorScheme: "light" | "dark";
  }
): string => {
  const backgroundColor = params.colorScheme === "dark" ? "#000" : "#fff";
  if (value === null || value === undefined) {
    return backgroundColor;
  }

  // Transform the range into the colorscale
  const colorValue = scaleValue(value, params.fromRange, { min: 0, max: 1 });
  const stop = params.colorscale.find(([number, color]) =>
    colorValue <= number ? color : false
  );
  if (!stop?.[1]) {
    return backgroundColor;
  }
  return stop[1];
};
