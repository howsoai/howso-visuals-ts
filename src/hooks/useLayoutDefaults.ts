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

  const paperColor = colorScheme === "dark" ? "#374151" : "#FFF";
  const textColor = colorScheme === "dark" ? "#FFF" : "#000";

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
      color: textColor,
    },
    xaxis: {
      ...axisDefaults,
      tickangle: 90,
    },
    yaxis: {
      ...axisDefaults,
    },
    hoverlabel: {
      bgcolor: paperColor,
      font: {
        color: textColor,
      },
    },
    legend: {
      bgcolor: paperColor,
      font: {
        color: textColor,
      },
    },
  };
};
