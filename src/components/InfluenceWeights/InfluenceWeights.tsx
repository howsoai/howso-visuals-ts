import type { Data, Layout, ScatterData } from "plotly.js";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { FormatCategoryTickTextParams, parseNA, roundTo } from "../..";
import { getColorScheme } from "../../colors";
import {
  getCaseLabel,
  getDataMeta,
  type ScreenSizeHookProps,
  useLayoutCategoryAxisDefaults,
  UseLayoutCategoryAxisDefaultsParams,
  useLayoutDefaults,
  useSemanticColors,
} from "../../hooks";
import { Case, IdFeaturesProps } from "../../types";
import { type BaseVisualProps, plotDefaults } from "../BaseVisual";
// customizable method: use your own `Plotly` object as we're using a rebuild strict distribution
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-expect-error
import Plotly from "plotly.js-strict-dist";
const Plot = createPlotlyComponent(Plotly);

type GetInfluenceDataGroups = (
  data: Partial<ScatterData>
) => Partial<ScatterData>[];
const getDefaultInfluenceDataGroups: GetInfluenceDataGroups = (data) => [data];

export type InfluenceWeightsProps = BaseVisualProps &
  IdFeaturesProps &
  ScreenSizeHookProps & {
    className?: string;
    /**
     * A function that uses the created ScatterData for all cases that would be rendered.
     * It may split the data into different groups assigning specific additional
     * customizations as required.
     *
     * Access to the original influence cases is expected to be maintained on the providing system.
     * Ensure this function is static. If dynamic, apply a useCallback pattern.
     */
    getInfluenceDataGroups?: GetInfluenceDataGroups;
    /** response.content?.influential_cases?.[0] ?? [], */
    influenceCases: Case[];
    predictionCase: Case;
    featureX: string;
    featureY: string;
    formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
    style?: CSSProperties;
  };

/**
 * Displays cases in space based on X and Y as their location and weight as their size.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=54-819&mode=design
 * @see https://plotly.com/python/reference/scatter/
 */
export function InfluenceWeights({
  featureX,
  featureY,
  formatParams,
  getInfluenceDataGroups = getDefaultInfluenceDataGroups,
  idFeatures,
  influenceCases,
  isDark,
  isPrint,
  layout: layoutProp,
  name = "Influence weights",
  predictionCase,
  screenSizes,
  ...props
}: InfluenceWeightsProps): ReactNode {
  const colorScheme = getColorScheme({ isDark, isPrint });
  const semanticColors = useSemanticColors({ colorScheme });

  // Create layout
  const layoutDefaults = useLayoutDefaults({ colorScheme });
  // X Axis
  const xMeta = useMemo(() => {
    const values = influenceCases.map((ic) => ic[featureX]);
    return getDataMeta([...values, predictionCase[featureX]]);
  }, [featureX, influenceCases, predictionCase]);
  const xAxisUseLayoutCategoryAxisArgs = useMemo(
    (): UseLayoutCategoryAxisDefaultsParams | undefined =>
      !xMeta.categories
        ? undefined
        : { categories: xMeta.categories, formatParams, screenSizes },
    [xMeta, formatParams, screenSizes]
  );
  const xAxisCategoryDefaults = useLayoutCategoryAxisDefaults(
    xAxisUseLayoutCategoryAxisArgs
  );
  // Y Axis
  const yMeta = useMemo(() => {
    const values = influenceCases.map((ic) => ic[featureY]);
    return getDataMeta([...values, predictionCase[featureY]]);
  }, [featureY, influenceCases, predictionCase]);
  const yAxisUseLayoutCategoryAxisArgs = useMemo(
    (): UseLayoutCategoryAxisDefaultsParams | undefined =>
      !yMeta.categories
        ? undefined
        : { categories: yMeta.categories, formatParams, screenSizes },
    [yMeta, formatParams, screenSizes]
  );
  const yAxisCategoryDefaults = useLayoutCategoryAxisDefaults(
    yAxisUseLayoutCategoryAxisArgs
  );

  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      ...layoutProp,
      xaxis: {
        ...layoutDefaults.xaxis,
        ...xAxisCategoryDefaults,
        ...layoutProp?.xaxis,
        tickcolor: "transparent",
        automargin: true,
        title: featureX,
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        ...yAxisCategoryDefaults,
        ...layoutProp?.yaxis,
        tickcolor: "transparent",
        title: featureY,
      },
      legend: {
        ...layoutDefaults.legend,
        itemsizing: "constant",
        ...layoutProp?.legend,
      },
    };
  }, [
    layoutDefaults,
    featureX,
    xAxisCategoryDefaults,
    featureY,
    yAxisCategoryDefaults,
    layoutProp,
  ]);

  // Create data
  const data = useMemo((): Data[] => {
    const data: Data[] = [];

    const sizemin = 6;
    const maxSize = 40;
    const influenceValues = influenceCases.reduce(
      (values, ic) => {
        const rawX = ic[featureX as string];
        const xValue = typeof rawX === "number" ? parseNA(rawX) : rawX;
        const rawY = ic[featureY as string];
        const yValue = typeof rawY === "number" ? parseNA(rawY) : rawY;
        const rawZ = ic[".influence_weight"];
        const zValue = typeof rawZ === "number" ? parseNA(rawZ) : 0;

        if (xValue === undefined || yValue === undefined) {
          return values;
        }

        values.x.push(xValue);
        values.y.push(yValue);
        values.z.push(zValue);
        values.text.push(
          [
            `Influence: ${roundTo(zValue * 100, 3)}%`,
            getCaseLabel({ case: ic, idFeatures }),
          ].join("<br />")
        );
        return values;
      },
      { x: [], y: [], z: [], text: [] } as {
        x: number[];
        y: number[];
        z: number[];
        text: string[];
      }
    );
    const maxZ = Math.max(...influenceValues.z);
    // A smaller sizeRef yields a bigger circle: e.g.
    // for a data value of 10, sizeref=10 would yield a circle of size 1,
    // but sizeref=1 would yield a circle of size 10.
    // The squaring is required if sizemode=area for obvious reasons.
    // The relative sizes of the circles to each other is z.
    // The absolute sizes are controlled by sizeref
    const sizeref = (2.0 * maxZ) / maxSize ** 2;

    const influenceData: Partial<ScatterData> = {
      name: "Influence case",
      x: influenceValues.x,
      y: influenceValues.y,
      type: "scatter",
      mode: "markers",
      marker: {
        color: semanticColors.secondary,
        size: influenceValues.z,
        sizeref,
        sizemin,
        sizemode: "area",
      },
      hovertemplate: `${featureX}: %{x:.3~f}<br />${featureY}: %{y:.3~f}<br />%{text}<extra></extra>`,
      text: influenceValues.text,
    };
    getInfluenceDataGroups(influenceData).forEach((influenceData) =>
      data.push(influenceData)
    );

    if (predictionCase) {
      const predictedData: Data = {
        name: "Predicted value",
        x: [predictionCase[featureX as string]],
        y: [predictionCase[featureY as string]],
        type: "scatter",
        mode: "markers",
        marker: {
          color: semanticColors.primary,
          size: maxSize / 2,
          sizeref,
          sizemin,
          sizemode: "area",
        },
        hovertemplate: `${featureX}: %{x}<br />${featureY}: %{y}<br />Predicted<extra></extra>`,
      };
      data.push(predictedData);
    }

    return data;
  }, [
    semanticColors,
    getInfluenceDataGroups,
    featureX,
    featureY,
    idFeatures,
    influenceCases,
    predictionCase,
  ]);

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
