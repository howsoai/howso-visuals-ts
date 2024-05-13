import { CSSProperties, ReactNode, useMemo } from "react";
import type { Layout, Data, ColorScale, Annotations } from "plotly.js";
import Plot from "react-plotly.js";
import { colorbarDefaults } from "../../plotly/colorbar";
import { BaseVisualProps, plotDefaults } from "../BaseVisual";
import { FormatCategoryTickTextParams } from "../../utils";
import { type ScreenSizeHookProps } from "../../hooks";
import {
  Divergent1Colorway,
  getColorFromScale,
  getColorScheme,
  getContrastingTextColor,
} from "../../colors";
import {
  type UseLayoutCategoryAxisDefaultsParams,
  useLayoutCategoryAxisDefaults,
  useLayoutDefaults,
} from "../../hooks";

export type AnomaliesProps = BaseVisualProps &
  ScreenSizeHookProps & {
    anomalies: Record<string, string | number | null>[];
    convictions: Record<string, number | null>[];
    /**
     * Number of cases to display.
     * Default: 5
     * If 0, all features will be displayed.
     */
    limit?: number;
    /**
     * Provides the bar's fill color if provided.
     * Colors will be distributed unevenly from 0 to 5 scale compressing the first half into 0 - 1 and the rest expanded 1-5.
     * Default: Divergent1
     */
    colors?: string[];
    className?: string;
    formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
    style?: CSSProperties;
  };

/**
 * A heat map which shows conviction values for each feature.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=54-476&mode=design
 * @see https://plotly.com/javascript/reference/heatmap
 */
export const Anomalies = ({
  anomalies: allAnomalies,
  convictions: allConvictions,
  colors = Divergent1Colorway,
  formatParams,
  isDark,
  isPrint,
  layout: layoutProp,
  limit = 5,
  name = "Anomalies",
  screenSizes,
  ...props
}: AnomaliesProps): ReactNode => {
  const colorScheme = getColorScheme({ isDark, isPrint });
  const colorscale = useMemo(() => getLocalColorScale(colors), [colors]);

  const { anomalies, features, z } = useMemo(
    () => ({
      anomalies: allAnomalies.slice(0, limit),
      features: Object.keys(allConvictions.at(0) || {}),
      z: allConvictions.slice(0, limit).reduce((z, row, rowIndex) => {
        z[rowIndex] ||= [];
        Object.entries(row).forEach(([, conviction], columnIndex) => {
          z[rowIndex][columnIndex] = conviction;
        });
        return z;
      }, [] as (number | null)[][]),
    }),
    [allAnomalies, allConvictions, limit]
  );

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
    () => getAnnotations({ colorscale, colorScheme, categories: features, z }),
    [colorscale, colorScheme, features, z]
  );

  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      ...layoutProp,
      // @ts-expect-error TODO https://plotly.com/javascript/reference/layout/coloraxis/#layout-coloraxis
      coloraxis: {
        colorbar: {
          ...colorbarDefaults,
          font: { color: colorScheme === "dark" ? "#fff" : "000" },
          labelalias: { 5: "≥5" },
          title: "Conviction",
        },
        colorscale,
        cmax: 5,
        cmin: 0,
      },
      xaxis: {
        ...layoutDefaults.xaxis,
        ...categoryAxisDefaults,
        ...layoutProp?.xaxis,
        automargin: true,
        gridcolor: "transparent",
        title: { text: "Feature" },
        tickcolor: "transparent",
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        ...layoutProp?.yaxis,
        autorange: "reversed",
        gridcolor: "transparent",
        tickcolor: "transparent",
        zeroline: false,
      },
      annotations,
    };
  }, [
    colorScheme,
    colorscale,
    layoutDefaults,
    categoryAxisDefaults,
    annotations,
    layoutProp,
  ]);

  // Create data
  const data = useMemo(
    (): Data[] => [
      {
        type: "heatmap",
        x: features,
        xgap: gap,
        y: anomalies.map((_, index) => index),
        ygap: gap,
        z,
        zmin: min,
        zmax: max,
        // @ts-expect-error TODO https://plotly.com/javascript/reference/heatmap/#coloraxis
        coloraxis: "coloraxis",
        hoverongaps: false,
        text: [],
        texttemplate: "%{text}",
        hovertemplate: "Conviction=%{z}<extra></extra>",
      },
    ],
    [features, anomalies, z]
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
};

const gap = 3;
const min = 0;
const max = 5;

type GetAnnotationsParams = {
  colorscale: ColorScale;
  colorScheme: "light" | "dark";
  categories: string[];
  z: (number | null)[][];
};
const getAnnotations = ({
  colorscale,
  colorScheme,
  categories,
  z,
}: GetAnnotationsParams): Layout["annotations"] =>
  z.reduce((annotations, row, rowIndex) => {
    const additions = row.reduce((additions, value, columnIndex) => {
      const backgroundColor = getColorFromScale(Math.min(max, value || 1), {
        colorscale: colorscale as [number, string][],
        colorScheme,
        fromRange: { max, min },
      });
      const textColor = getContrastingTextColor(backgroundColor);
      const annotation: Partial<Annotations> = {
        xref: "x",
        yref: "y",
        x: categories[columnIndex],
        y: rowIndex,
        text: value ? value.toPrecision(4) : "",
        showarrow: false,
        font: { color: textColor },
      };

      return [...additions, annotation];
    }, [] as Layout["annotations"]);

    return [...annotations, ...additions];
  }, [] as Layout["annotations"]);

/**
 * Colors will be distributed unevenly from 0 to 5 scale compressing the first half into 0 - 1 and the rest expanded 1-5.
 **/
const getLocalColorScale = (colors: string[]): ColorScale => {
  if (colors.length < 3) {
    throw new Error("At least three colors must be provided to make a scale");
  }

  const chunk1 = colors.slice(0, colors.length / 2);
  const chunk2 = colors.slice(colors.length / 2, colors.length);

  // Chunk 1 goes from 0-1
  const chunk1Step = 0.2 / chunk1.length;
  // Chunk 2 goes from 1-5, but we can use 0-4 in terms of step
  const chunk2Step = 0.8 / chunk2.length;

  // @ts-expect-error TODO Types are wrong https://plotly.com/javascript/reference/heatmap/#heatmap-colorscale
  return [
    ...chunk1.map((color, index) => [chunk1Step * index, color as string]),
    ...chunk2.map((color, index) => [
      index === chunk2.length - 1 ? 1 : 0.2 + chunk2Step * index,
      color as string,
    ]),
  ];
};
