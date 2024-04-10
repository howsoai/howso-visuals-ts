import { useMemo, type CSSProperties, ReactNode } from "react";
import Plot from "react-plotly.js";
import { FeatureContributionsBaseVisualProps, plotDefaults } from "../..";
import { ColorShade, SemanticColors, getColorScheme } from "../../../colors";
import { useLayoutDefaults } from "../../../hooks";
import { Datum, Layout, type PlotData } from "plotly.js";
import { formatCategoryTickText } from "../../../utils/formatting";

// See https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=20-116&mode=design&t=EAIu2Lqzf3bekOkQ-4

export interface FeatureContributionsVerticalBarChartProps
  extends FeatureContributionsBaseVisualProps {
  /**
   * Provides the bar's fill color if provided.
   * Default: Scheme and print aware semantic primary.
   */
  color?: ColorShade;
  className?: string;
  style?: CSSProperties;
  /**
   * The number of bars to show.
   * Default: 10
   * If 0, all features will be displayed.
   **/
  limit?: number;
}

/**
 * Displays feature contributions.
 * By default the first first 10 are displayed.
 */
export function FeatureContributionsVerticalBarChart({
  isDark,
  isPrint,
  layout: layoutProp,
  color: colorProp,
  name = "Feature contributions",
  features,
  limit = 10,
  ...props
}: FeatureContributionsVerticalBarChartProps): ReactNode {
  const colorScheme = getColorScheme({ isDark, isPrint });

  const color = colorProp || SemanticColors.primary[colorScheme]["900"];
  const layoutDefaults = useLayoutDefaults({ colorScheme });

  // Create sorted ata
  const sortedData = useMemo(() => {
    const sortedData = Object.entries(features).reduce(
      (data, [feature, value]) => {
        data.push({ feature, value });
        return data;
      },
      [] as { feature: string; value: number }[]
    );
    sortedData.sort((a, b) => b.value - a.value);

    const sliceLimit = limit === 0 ? undefined : limit;
    return sortedData.slice(0, sliceLimit);
  }, [limit, features]);

  // Create the layout (which depends on the data sadly)
  const layout = useMemo((): Partial<Layout> => {
    const { ticktext, tickvals } = sortedData.reduce(
      ({ ticktext, tickvals }, { feature }, index) => {
        ticktext.push(formatCategoryTickText(feature));
        tickvals.push(index);
        return { ticktext, tickvals };
      },
      { ticktext: [] as string[], tickvals: [] as any[] }
    );

    return {
      ...layoutDefaults,
      xaxis: {
        ...layoutDefaults.xaxis,
        title: { text: "Feature" },
        tickangle: 90,
        ticktext,
        tickvals,
        tickmode: "array",
        ticks: "outside",
        tickcolor: "transparent",

        gridcolor: "transparent",
        automargin: true,
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        title: { text: "Contribution" },
        automargin: true,
        ticks: "outside",
        tickcolor: "transparent",
      },
      // @ts-expect-error https://plotly.com/javascript/reference/layout/#layout-barcornerradius
      barcornerradius: 4,
      ...layoutProp,
    };
  }, [layoutDefaults, layoutProp, sortedData]);

  // Create the data
  const data = useMemo((): Partial<PlotData> => {
    const { x, y } = sortedData.reduce(
      ({ x, y }, { feature, value }) => {
        x.push(feature);
        y.push(value);
        return { x, y };
      },
      { x: [], y: [] } as { x: Datum[]; y: Datum[] }
    );
    return {
      x,
      y,
      type: "bar",
      name,
      marker: { color },
      hovertemplate:
        "<b>%{hovertext}</b><br />%{yaxis.title.text}: %{y:.4~f}<extra></extra>",
      hoverinfo: "y+text",
      hovertext: x.map((datum) => (datum || "").toString()),
    };
  }, [name, sortedData, color]);

  return (
    <Plot
      {...plotDefaults}
      {...props}
      data={[data]}
      layout={layout}
      config={{
        ...plotDefaults.config,
        displayModeBar: true,
      }}
    />
  );
}
