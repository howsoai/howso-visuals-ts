import { useMemo, type CSSProperties, type ReactNode } from "react";
import Plot from "react-plotly.js";
import { type FeatureContributionsBaseVisualProps, plotDefaults } from "../..";
import {
  type ColorShade,
  SemanticColors,
  getColorScheme,
} from "../../../colors";
import { useLayoutDefaults } from "../../../hooks";
import type { Datum, Layout, PlotData } from "plotly.js";
import {
  UseLayoutCategoryAxisDefaultsParams,
  useLayoutCategoryAxisDefaults,
} from "../../../hooks";

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
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=20-116&mode=design&t=EAIu2Lqzf3bekOkQ-4
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
  // Create sorted data
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

  // Create layout defaults
  const colorScheme = getColorScheme({ isDark, isPrint });
  const color = colorProp || SemanticColors.primary[colorScheme]["900"];
  const layoutDefaults = useLayoutDefaults({ colorScheme });

  // Create category axis defaults
  const useLayoutCategoryAxisArgs = useMemo(
    (): UseLayoutCategoryAxisDefaultsParams => ({
      categories: sortedData.map(({ feature }) => feature),
    }),
    [sortedData]
  );
  const categoryAxisDefaults = useLayoutCategoryAxisDefaults(
    useLayoutCategoryAxisArgs
  );

  // Create the layout
  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      xaxis: {
        ...layoutDefaults.xaxis,
        ...categoryAxisDefaults,
        title: { text: "Feature" },
        tickcolor: "transparent",
        gridcolor: "transparent",
        automargin: true,
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        title: { text: "Contribution" },
        tickcolor: "transparent",
      },
      // @ts-expect-error https://plotly.com/javascript/reference/layout/#layout-barcornerradius
      barcornerradius: 4,
      ...layoutProp,
    };
  }, [layoutDefaults, categoryAxisDefaults, layoutProp]);

  // Create the data
  const data = useMemo((): [Partial<PlotData>] => {
    const { x, y } = sortedData.reduce(
      ({ x, y }, { feature, value }) => {
        x.push(feature);
        y.push(value);
        return { x, y };
      },
      { x: [], y: [] } as { x: Datum[]; y: Datum[] }
    );

    return [
      {
        x,
        y,
        type: "bar",
        name,
        marker: { color },
        hovertemplate:
          "<b>%{hovertext}</b><br />%{yaxis.title.text}: %{y:.4~f}<extra></extra>",
        hoverinfo: "y+text",
        hovertext: x.map((datum) => (datum || "").toString()),
      },
    ];
  }, [name, sortedData, color]);

  // Create the config
  const config = useMemo(
    () => ({
      ...plotDefaults.config,
      displayModeBar: true,
    }),
    []
  );

  return (
    <Plot
      {...plotDefaults}
      {...props}
      data={data}
      layout={layout}
      config={config}
    />
  );
}
