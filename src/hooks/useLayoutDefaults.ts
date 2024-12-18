import type { Layout, LayoutAxis } from "plotly.js";
import { useMemo } from "react";
import { getSemanticColors } from "../colors";

export const useLayoutDefaults = (
  params: UseLayoutDefaultsParams
): Partial<Layout> => {
  const layoutDefaults = useMemo(() => getLayoutDefaults(params), [params]);

  return layoutDefaults;
};

export const useSankeyLayoutDefaults = (
  params: UseLayoutDefaultsParams
): Partial<Layout> => {
  const layoutDefaults = useMemo(() => {
    const defaults = getLayoutDefaults(params);
    // paper_bgcolor affects lines between nodes
    delete defaults.paper_bgcolor;
    delete defaults.xaxis;
    delete defaults.yaxis;
    return defaults;
  }, [params]);

  return layoutDefaults;
};

export type UseLayoutDefaultsParams = {
  colorScheme: "light" | "dark";
};
/** A direct utility for getting defaults. For ease, you may prefer useLayoutDefaults. */
export const getLayoutDefaults = ({
  colorScheme,
}: UseLayoutDefaultsParams): Partial<Layout> => {
  const semanticColors = getSemanticColors({ colorScheme });
  const axisDefaults: Partial<LayoutAxis> = {
    automargin: true,
    ticks: "outside",
    gridcolor: semanticColors.divider,
    tickcolor: semanticColors.text.secondary,
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
      color: semanticColors.text.primary,
    },
    xaxis: {
      ...axisDefaults,
      tickangle: 90,
      gridcolor: semanticColors.divider,
    },
    yaxis: {
      ...axisDefaults,
      gridcolor: semanticColors.divider,
    },
    hoverlabel: {
      bgcolor: semanticColors.background.paper,
      font: {
        color: semanticColors.text.primary,
      },
    },
    legend: {
      bgcolor: semanticColors.background.paper,
      font: {
        color: semanticColors.text.primary,
      },
    },
  };
};
