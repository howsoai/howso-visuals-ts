import { Layout } from "plotly.js";
import { useState, useLayoutEffect, useMemo } from "react";
import { Gray } from "../colors";

export function useLayoutDefaults({
  colorScheme,
}: UseLayoutDefaultsParams): Partial<Layout> {
  const layoutDefaults = useMemo(
    () => getLayoutDefaults({ colorScheme }),
    [colorScheme]
  );

  return layoutDefaults;
}

export type UseLayoutDefaultsParams = {
  colorScheme: "light" | "dark";
};
/** A direct utility for getting defaults. For ease, you may prefer useLayoutDefaults. */
export const getLayoutDefaults = ({
  colorScheme,
}: UseLayoutDefaultsParams): Partial<Layout> => ({
  autosize: true,
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  margin: {
    // @ts-expect-error https://plotly.com/javascript/reference/layout/#layout-margin-autoexpand
    autoexpand: true,
  },
  font: {
    family: "Inter, system-ui, sans-serif",
    color: colorScheme === "dark" ? "#fff" : "#000",
  },
  xaxis: {
    gridcolor:
      colorScheme === "dark" ? Gray["dark"]["100"] : Gray["light"]["900"],
  },
  yaxis: {
    gridcolor:
      colorScheme === "dark" ? Gray["dark"]["100"] : Gray["light"]["900"],
  },
});
