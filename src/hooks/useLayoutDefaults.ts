import type { Layout, LayoutAxis } from "plotly.js";
import { useMemo } from "react";
import { Gray } from "../colors";

export const useLayoutDefaults = (
  params: UseLayoutDefaultsParams
): Partial<Layout> => {
  const layoutDefaults = useMemo(() => getLayoutDefaults(params), [params]);

  return layoutDefaults;
};

export type UseLayoutDefaultsParams = {
  colorScheme: "light" | "dark";
};
/** A direct utility for getting defaults. For ease, you may prefer useLayoutDefaults. */
export const getLayoutDefaults = ({
  colorScheme,
}: UseLayoutDefaultsParams): Partial<Layout> => {
  const axisDefaults: Partial<LayoutAxis> = {
    automargin: true,
    ticks: "outside",
    gridcolor:
      colorScheme === "dark" ? Gray["dark"]["100"] : Gray["light"]["900"],
    tickcolor:
      colorScheme === "dark" ? Gray["dark"]["700"] : Gray["light"]["700"],
  };

  return {
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
      ...axisDefaults,
      tickangle: 90,
    },
    yaxis: {
      ...axisDefaults,
    },
  };
};
