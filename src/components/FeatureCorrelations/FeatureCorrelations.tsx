import type { Annotations, ColorScale, Data, Datum, Layout } from "plotly.js";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { FormatCategoryTickTextParams } from "../..";
import {
  Divergent1Colorway,
  getColorFromScale,
  getColorScale,
  getColorScheme,
  getContrastingTextColor,
} from "../../colors";
import {
  type ScreenSizeHookProps,
  type UseLayoutCategoryAxisDefaultsParams,
  useLayoutCategoryAxisDefaults,
  useLayoutDefaults,
} from "../../hooks";
import { colorbarDefaults } from "../../plotly/colorbar";
import { type BaseVisualProps, plotDefaults } from "../BaseVisual";
// customizable method: use your own `Plotly` object as we're using a rebuild strict distribution
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-expect-error
import Plotly from "plotly.js-strict-dist";
const Plot = createPlotlyComponent(Plotly);

export type FeatureCorrelationsProps = BaseVisualProps &
  ScreenSizeHookProps & {
    /**
     * Provides the bar's fill color if provided.
     * Colors will be distributed evenly along -1 to 1 scale based on array index.
     * Default: Divergent1
     */
    colors?: string[];
    className?: string;
    /**
     * A nested array structure of values where the indexes of any two features yield their correlation value.
     * Values should be between -1 and 1, undefined or null.
     *
     * Example:
     * [
     *   [.1, null, .3, .5, .1],
     *   [.2, .1, .6, .8, .3],
     *   [.3, .6, .1, -.1, .20],
     * ]
     */
    correlations: FeatureCorrelationsValues[];
    features: string[];
    formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
    style?: CSSProperties;
  };

type FeatureCorrelationsValue = number | undefined | null;
type FeatureCorrelationsValues = FeatureCorrelationsValue[];

/**
 * Displays feature correlations.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=59-2&mode=design&t=07S9UjPgzA1yRMlD-4
 * @see https://plotly.com/javascript/reference/heatmap
 */
export function FeatureCorrelations({
  colors = Divergent1Colorway,
  correlations,
  features,
  formatParams,
  isDark,
  isPrint,
  layout: layoutProp,
  name = "Feature correlations",
  screenSizes,
  ...props
}: FeatureCorrelationsProps): ReactNode {
  const colorScheme = getColorScheme({ isDark, isPrint });
  const colorscale = useMemo(() => getColorScale(colors), [colors]);

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
  const annotations = useMemo(
    () => getAnnotations({ colorscale, colorScheme, features, correlations }),
    [colorscale, colorScheme, features, correlations]
  );
  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      ...layoutProp,
      xaxis: {
        ...layoutDefaults.xaxis,
        ...categoryAxisDefaults,
        ...layoutProp?.xaxis,
        tickcolor: "transparent",
        automargin: true,
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        ...categoryAxisDefaults,
        ...layoutProp?.yaxis,
        tickcolor: "transparent",
      },
      annotations,
    };
  }, [layoutDefaults, categoryAxisDefaults, layoutProp, annotations]);

  // Create data
  const data = useMemo(
    (): Data[] => [
      {
        x: features,
        y: features,
        z: correlations as Datum[][],
        zmin: min,
        zmax: max,
        type: "heatmap",
        // @ts-expect-error https://plotly.com/javascript/reference/heatmap/#heatmap-hoverongaps
        hoverongaps: false,
        colorscale,
        colorbar: colorbarDefaults,
      },
    ],
    [features, correlations, colorscale]
  );

  return (
    <Plot
      {...plotDefaults}
      {...props}
      data={data}
      layout={layout}
      config={plotDefaults.config}
    />
  );
}
const max = 1;
const min = -1;

type GetAnnotationsParams = Pick<
  FeatureCorrelationsProps,
  "features" | "correlations"
> & {
  colorscale: ColorScale;
  colorScheme: "light" | "dark";
};
const getAnnotations = ({
  colorscale,
  colorScheme,
  features,
  correlations,
}: GetAnnotationsParams): Layout["annotations"] =>
  features.reduce((annotations, rowFeature, rowIndex) => {
    const additions = features.reduce(
      (additions, columnFeature, columnIndex) => {
        const z = correlations[rowIndex][columnIndex];
        const backgroundColor = getColorFromScale(z, {
          colorscale: colorscale as [number, string][],
          colorScheme,
          fromRange: { max, min },
        });
        const textColor = getContrastingTextColor(backgroundColor);
        const annotation: Partial<Annotations> = {
          xref: "x",
          yref: "y",
          x: columnFeature,
          y: rowFeature,
          text: z ? z.toPrecision(4) : "",
          showarrow: false,
          font: { color: textColor },
        };

        return [...additions, annotation];
      },
      [] as Layout["annotations"]
    );

    return [...annotations, ...additions];
  }, [] as Layout["annotations"]);
