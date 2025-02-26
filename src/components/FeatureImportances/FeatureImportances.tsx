import type { Data, Datum, Layout } from "plotly.js";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { FormatCategoryTickTextParams } from "../..";
import { getColorScheme } from "../../colors";
import {
  type ScreenSizeHookProps,
  type UseLayoutCategoryAxisDefaultsParams,
  useLayoutCategoryAxisDefaults,
  useLayoutDefaults,
  useSemanticColors,
} from "../../hooks";
import { type BaseVisualProps, plotDefaults } from "../BaseVisual";
// customizable method: use your own `Plotly` object as we're using a rebuild strict distribution
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-expect-error
import Plotly from "plotly.js-strict-dist";
const Plot = createPlotlyComponent(Plotly);

export type FeatureImportancesBaseProps = BaseVisualProps &
  ScreenSizeHookProps & {
    /**
     * Provides the bar's fill color if provided.
     * Default: Scheme and print aware semantic primary.
     */
    color?: string;
    className?: string;
    /** A list of features, if known ahead of data being loaded to pre-create the category axis. */
    features?: string[];
    formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
    /**
     * The number of bars to show.
     * Default: 10
     * If 0, all features will be displayed.
     **/
    limit?: number;
    style?: CSSProperties;
  };

export type FeatureImportancesContributionsProps =
  FeatureImportancesBaseProps & {
    metric: "prediction_contributions";
    data:
      | Record<string, { feature_robust_prediction_contributions: number }>
      | undefined;
  };

export type FeatureImportancesMDAProps = FeatureImportancesBaseProps & {
  metric: "accuracy_contributions";
  data:
    | Record<string, { feature_robust_accuracy_contributions: number }>
    | undefined;
};

/**
 * Displays feature importances.
 * By default the first first 10 are displayed.
 * This method is designed to work with HowsoInsights.get_feature_importance data.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=20-116&mode=design&t=EAIu2Lqzf3bekOkQ-4
 */
export const FeatureImportances = ({
  color: colorProp,
  features: featuresProps,
  formatParams,
  isDark,
  isPrint,
  isLoading,
  layout: layoutProp,
  limit,
  metric,
  name,
  screenSizes,
  ...props
}:
  | FeatureImportancesContributionsProps
  | FeatureImportancesMDAProps): ReactNode => {
  name = name
    ? name
    : metric === "prediction_contributions"
    ? "Prediction contributions"
    : "Accuracy contributions";
  const features = useMemo(
    () => featuresProps || Object.keys(props.data || {}),
    [featuresProps, props.data]
  );

  // Create sorted data
  type SortedFeature = { feature: string; value: number };
  const sortedData = useMemo(() => {
    // Are we loading?
    if (isLoading) {
      const _limit = limit || 10;
      return new Array(_limit).fill(0).map((_, index) => ({
        feature: index.toString(),
        value: (_limit - index) / _limit,
      }));
    }

    // Actual data
    const sortedData = Object.entries(props.data || {}).reduce(
      (data, [feature, details]) => {
        data.push({
          feature,
          value:
            metric === "prediction_contributions"
              ? details.feature_robust_prediction_contributions
              : details.feature_robust_accuracy_contributions,
        });
        return data;
      },
      [] as SortedFeature[]
    );
    sortedData.sort((a, b) => b.value - a.value);

    const sliceLimit = limit === 0 ? undefined : limit;
    return sortedData.slice(0, sliceLimit);
  }, [limit, isLoading, metric, props.data]);

  const colorScheme = getColorScheme({ isDark, isPrint });
  const semanticColors = useSemanticColors({ colorScheme });
  const color = colorProp || semanticColors.primary;

  // Create layout
  const layoutDefaults = useLayoutDefaults({ colorScheme });
  const useLayoutCategoryAxisArgs = useMemo(
    (): UseLayoutCategoryAxisDefaultsParams => ({
      categories: features,
      formatParams,
      screenSizes,
    }),
    [features, formatParams, screenSizes]
  );
  const categoryAxisDefaults = useLayoutCategoryAxisDefaults(
    useLayoutCategoryAxisArgs
  );
  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      xaxis: {
        ...layoutDefaults.xaxis,
        ...categoryAxisDefaults,
        title: { text: "Feature", standoff: 5 },
        ...layoutProp?.xaxis,
        tickcolor: "transparent",
        automargin: true,
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        title: { text: "Importance", standoff: 5 },
        tickcolor: "transparent",
        ...layoutProp?.yaxis,
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

  // Create data
  const plotlyData = useMemo((): Data[] => {
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
  }, [semanticColors.divider, isLoading, name, sortedData, color]);

  return (
    <Plot
      {...plotDefaults}
      {...props}
      data={plotlyData}
      layout={layout}
      config={plotDefaults.config}
    />
  );
};
