import { type CSSProperties, type ReactNode, useMemo } from "react";
import Plot from "react-plotly.js";
import {
  Divergent1Colorway,
  getColorFromScale,
  getColorScale,
  getColorScheme,
  getContrastingTextColor,
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
import { colorbarDefaults } from "../../plotly/colorbar";

export type InfluenceWeightsProps = BaseVisualProps & {
  className?: string;
  features: string[];
  formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
  /**
   * An optional set of redefined screen sizes to use in breakpoint logic.
   * Labels will be wrapped to a secondary line based on screen size.
   *   sm: <= 10
   *   md: <= 20
   *   lg: <= 25
   **/
  screenSizes?: ScreenSizes;
  style?: CSSProperties;
};

/**
 * Displays feature correlations.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=54-819&mode=design
 * @see
 */
export function InfluenceWeights({
  features,
  formatParams,
  isDark,
  isPrint,
  layout: layoutProp,
  name = "Feature correlations",
  screenSizes,
  ...props
}: InfluenceWeightsProps): ReactNode {
  const colorScheme = getColorScheme({ isDark, isPrint });

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
    };
  }, [layoutDefaults, categoryAxisDefaults, layoutProp]);

  // Create data
  const data = useMemo(
    (): Data[] => [
      {
        x: features,
        y: features,
        zmin: min,
        zmax: max,
        type: "scatter",
      },
    ],
    [features]
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
