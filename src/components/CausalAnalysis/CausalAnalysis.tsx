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
      Source: Record<string, string>;
      Destination: Record<string, string>;
      Delta: Record<string, number>;
    };
    features: string[];
    formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
    metric: "feature_contributions" | "MDA";
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
  features,
  formatParams,
  isDark,
  isPrint,
  layout: layoutProp,
  metric,
  name: nameProp,
  screenSizes,
  ...props
}: CausalAnalysisProps): ReactNode {
  const name = nameProp
    ? nameProp
    : metric === "feature_contributions"
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
          font: { size: 12, color: semanticColors.divider },
        },
      ],
    };
  }, [layoutDefaults, semanticColors.divider, name, layoutProp]);

  // Create data
  const sankeyData = useMemo((): Partial<SankeyData>[] => {
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
        type: "sankey",
        orientation: "h",
        node: {
          pad: 15,
          thickness: 30,
          line: {
            color: "black",
            width: 0.5,
          },
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
  }, [semanticColors.primary, data]);

  console.info("layout", layout);
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
