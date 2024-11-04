import type { Config, Datum, Layout, PlotData } from "plotly.js";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { getColorScheme } from "../../../colors";
import {
  useLayoutCategoryAxisDefaults,
  useLayoutDefaults,
  useSemanticColors,
  type ScreenSizeHookProps,
  type UseLayoutCategoryAxisDefaultsParams,
} from "../../../hooks";
import { FormatCategoryTickTextParams } from "../../../utils";
import { plotDefaults } from "../../BaseVisual";
import { FeatureContributionsBaseVisualProps } from "../FeatureContributions.types";
// customizable method: use your own `Plotly` object as we're using a rebuild strict distribution
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-expect-error
import Plotly from "plotly.js-strict-dist";
const Plot = createPlotlyComponent(Plotly);

export type FeatureContributionsVerticalBarChartProps =
  FeatureContributionsBaseVisualProps &
    ScreenSizeHookProps & {
      className?: string;
      /**
       * Provides the bar's fill color if provided.
       * Default: Scheme and print aware semantic primary.
       */
      color?: string;
      formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
      /**
       * The number of bars to show.
       * Default: 10
       * If 0, all features will be displayed.
       **/
      limit?: number;
      style?: CSSProperties;
    };

/**
 * Displays feature contributions.
 * By default the first first 10 are displayed.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=20-116&mode=design&t=EAIu2Lqzf3bekOkQ-4
 */
export function FeatureContributionsVerticalBarChart({
  color: colorProp,
  features,
  formatParams,
  layout: layoutProp,
  limit = 10,
  isDark,
  isLoading,
  isPrint,
  name = "Feature contributions",
  screenSizes,
  ...props
}: FeatureContributionsVerticalBarChartProps): ReactNode {
  // Create sorted data
  type SortedFeature = { feature: string; value: number };
  const sortedData = useMemo(() => {
    const entries = Object.entries(features);
    // Are we loading?
    if (isLoading) {
      const _limit = limit || 10;
      return new Array(_limit).fill(0).map((_, index) => ({
        feature: index.toString(),
        value: (_limit - index) / _limit,
      }));
    }

    // Actual data
    const sortedData = entries.reduce((data, [feature, value]) => {
      data.push({ feature, value });
      return data;
    }, [] as SortedFeature[]);
    sortedData.sort((a, b) => b.value - a.value);

    const sliceLimit = limit === 0 ? undefined : limit;
    return sortedData.slice(0, sliceLimit);
  }, [limit, features, isLoading]);

  // Create layout defaults
  const colorScheme = getColorScheme({ isDark, isPrint });
  const semanticColors = useSemanticColors({ colorScheme });
  const color = colorProp || semanticColors.primary;
  const layoutDefaults = useLayoutDefaults({ colorScheme });

  // Create category axis defaults
  const useLayoutCategoryAxisArgs = useMemo(
    (): UseLayoutCategoryAxisDefaultsParams => ({
      categories: sortedData.map(({ feature }) => feature),
      formatParams,
      screenSizes,
    }),
    [sortedData, formatParams, screenSizes]
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
        title: { text: "Feature", standoff: 5 },
        tickcolor: "transparent",
        gridcolor: "transparent",
        automargin: true,
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        title: { text: "Contribution", standoff: 5 },
        tickcolor: "transparent",
      },
      margin: {
        pad: 0,
        t: 0,
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
        marker: { color: isLoading ? semanticColors.divider : color },
        hovertemplate:
          "<b>%{hovertext}</b><br />%{yaxis.title.text}: %{y:.4~f}<extra></extra>",
        hoverinfo: "y+text",
        hovertext: x.map((datum) => (datum || "").toString()),
      },
    ];
  }, [semanticColors.divider, name, isLoading, sortedData, color]);

  // Create the config
  const config = useMemo(
    (): Partial<Config> => ({
      ...plotDefaults.config,
      displayModeBar: "hover",
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
