import type { Layout, SankeyData } from "plotly.js";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { FormatCategoryTickTextParams } from "../..";
import { getColorScheme } from "../../colors";
import {
  type ScreenSizeHookProps,
  useSankeyLayoutDefaults,
  useSemanticColors,
} from "../../hooks";
import { type BaseVisualProps, plotDefaults } from "../BaseVisual";
// customizable method: use your own `Plotly` object as we're using a rebuild strict distribution
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-expect-error
import Plotly from "plotly.js-strict-dist";
const Plot = createPlotlyComponent(Plotly);

export type CausalAnalysisProps = BaseVisualProps &
  ScreenSizeHookProps & {
    className?: string;
    /** Data is designed to work with the return shape of HowsoInsights.get_causal_analysis()'s CausalResults */
    data?: {
      Source: Record<number, string>;
      Destination: Record<number, string>;
      Delta: Record<number, number>;
    };
    formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
    metric: "prediction_contributions" | "accuracy_contributions";
    style?: CSSProperties;
  };

/**
 * Displays causal analysis results.
 *
 * Designed to work with the results of HowsoInsights.get_causal_results().
 *
 * @see https://plotly.com/javascript/sankey-diagram/
 */
export function CausalAnalysis({
  data,
  formatParams,
  isDark,
  isLoading,
  isPrint,
  layout: layoutProp,
  metric,
  name: nameProp,
  screenSizes,
  ...props
}: CausalAnalysisProps): ReactNode {
  const name = nameProp
    ? nameProp
    : metric === "prediction_contributions"
    ? "Predictability drivers"
    : "Uncertainty drivers";

  const colorScheme = getColorScheme({ isDark, isPrint });
  const semanticColors = useSemanticColors({ colorScheme });

  // Create layout
  const layoutDefaults = useSankeyLayoutDefaults({ colorScheme });
  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      ...layoutProp,
      title: name,
      margin: {
        ...layoutDefaults.margin,
        pad: 0,
        t: 30,
        b: 30,
      },
      annotations: [
        {
          x: 0.5,
          y: -0.05,
          text: "Directionality of the feature relationships flow from left to right.",
          showarrow: false,
          xref: "paper",
          yref: "paper",
          font: { size: 12, color: semanticColors.text.secondary },
        },
      ],
    };
  }, [layoutDefaults, semanticColors.text.secondary, name, layoutProp]);

  // Create data
  const sankeyData = useMemo((): Partial<SankeyData>[] => {
    const dataDefaults: Partial<SankeyData> = {
      type: "sankey",
      orientation: "h",
      node: {
        pad: 15,
        thickness: 20,
      },
    };
    if (isLoading) {
      return [
        {
          ...dataDefaults,
          node: {
            ...dataDefaults.node,
            pad: 50,
            label: ["", "", "", "", "", ""],
            color: [
              semanticColors.text.secondary,
              semanticColors.text.secondary,
              semanticColors.text.secondary,
              semanticColors.text.secondary,
              semanticColors.text.secondary,
              semanticColors.text.secondary,
            ],
          },

          link: {
            source: [0, 1, 0, 2, 3, 3],
            target: [2, 3, 3, 4, 4, 5],
            value: [8, 4, 2, 8, 4, 2],
          },
        },
      ];
    }

    const allNodes: string[] = Array.from(
      new Set([
        ...Object.values(data?.Source || []),
        ...Object.values(data?.Destination || []),
      ])
    );
    const nodeIndices: { [key: string]: number } = Object.fromEntries(
      allNodes.map((node, i) => [node, i])
    );

    const sourceIndex: number[] = Object.values(data?.Source || []).map(
      (node: string) => nodeIndices[node]
    );
    const destinationIndex: number[] = Object.values(
      data?.Destination || []
    ).map((node: string) => nodeIndices[node]);

    const sankeyData: Partial<SankeyData>[] = [
      {
        ...dataDefaults,
        node: {
          ...dataDefaults.node,
          label: allNodes,
          color: new Array(allNodes.length).fill(semanticColors.primary),
        },

        link: {
          source: sourceIndex,
          target: destinationIndex,
          value: Object.values(data?.Delta || []),
        },
      },
    ];
    return sankeyData;
  }, [semanticColors.primary, semanticColors.text.secondary, isLoading, data]);

  return (
    <Plot
      {...plotDefaults}
      {...props}
      data={sankeyData}
      layout={layout}
      config={plotDefaults.config}
    />
  );
}
