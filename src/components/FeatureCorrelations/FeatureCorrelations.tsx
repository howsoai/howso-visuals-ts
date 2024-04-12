import { type CSSProperties, type ReactNode, useMemo } from "react";
import Plot from "react-plotly.js";
import {
  ColorShade,
  Divergent1,
  getColorScale,
  getColorScaleShade,
  getColorScheme,
  getTextColor,
} from "../../colors";
import {
  ScreenSizes,
  UseLayoutCategoryAxisDefaultsParams,
  useLayoutCategoryAxisDefaults,
  useLayoutDefaults,
} from "../../hooks";
import { type BaseVisualProps, plotDefaults } from "../BaseVisual";
import type { Annotations, ColorScale, Data, Datum, Layout } from "plotly.js";
import { FormatCategoryTickTextParams } from "../..";

export type FeatureCorrelationsProps = BaseVisualProps & {
  /**
   * Provides the bar's fill color if provided.
   * Colors will be distributed evenly along -1 to 1 scale based on array index.
   * Default: Divergent1
   */
  colors?: ColorShade[];
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
  /**
   * An optional set of redefined screen sizes to use in breakpoint logic.
   * Labels will be wrapped to a secondary line based on screen size:
   *   sm: <= 10
   *   md: <= 20
   *   lg: <= 25
   **/
  screenSizes?: ScreenSizes;
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
  colors = Divergent1,
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
    }),
    [features, formatParams]
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
  const data = useMemo((): Data[] => {
    return [
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
        colorbar: { borderwidth: 0, outlinewidth: 0 },
      },
    ];
  }, [features, correlations, colorscale]);

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
        const backgroundColor = getColorScaleShade(z, {
          colorscale: colorscale as [number, string][],
          colorScheme,
          fromRange: { max, min },
        });
        const textColor = getTextColor(backgroundColor);
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
