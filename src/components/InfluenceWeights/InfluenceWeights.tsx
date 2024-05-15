import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { getColorScheme } from "../../colors";
import {
  type ScreenSizeHookProps,
  useLayoutDefaults,
  getCaseLabel,
} from "../../hooks";
import { type BaseVisualProps, plotDefaults } from "../BaseVisual";
import type { Data, Layout } from "plotly.js";
import { FormatCategoryTickTextParams, parseNA, roundTo } from "../..";
import { Case, IdFeaturesProps } from "../../types";

export type InfluenceWeightsProps = BaseVisualProps &
  IdFeaturesProps &
  ScreenSizeHookProps & {
    className?: string;
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
 */
export function InfluenceWeights({
  featureX,
  featureY,
  formatParams,
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
  const [plot, setPlot] = useState<Plot | null>(null);

  // Create layout
  const layoutDefaults = useLayoutDefaults({ colorScheme });
  // const useLayoutCategoryAxisArgs = useMemo(
  //   (): UseLayoutCategoryAxisDefaultsParams => ({
  //     categories: features,
  //     formatParams,
  //     screenSizes,
  //   }),
  //   [features, formatParams, screenSizes]
  // );
  // const categoryAxisDefaults = useLayoutCategoryAxisDefaults(
  //   useLayoutCategoryAxisArgs
  // );
  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      ...layoutProp,
      xaxis: {
        ...layoutDefaults.xaxis,
        // ...categoryAxisDefaults,
        ...layoutProp?.xaxis,
        tickcolor: "transparent",
        automargin: true,
        title: featureX,
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        // ...categoryAxisDefaults,
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
  }, [layoutDefaults, featureX, featureY, layoutProp]);

  // Create data
  const data = useMemo((): Data[] => {
    if (!plot) {
      return [];
    }
    // Naive implementation
    const data: Data[] = [];

    // Split data into series
    // const { categorizedSeries, x, y } = cases.reduce<{
    //   // Series keyed by action value
    //   categorizedSeries: Record<string | number, ApexDataPoint[]>;
    //   // All x/y/z values
    //   x: number[];
    //   y: number[];
    // }>(
    //   (accumulator, current) => {
    //     const xValue = toRepresentation(
    //       xFeature,
    //       current[xFeature] as T[FeatureName<T>]
    //     );
    //     const yValue = toRepresentation(
    //       yFeature,
    //       current[yFeature] as T[FeatureName<T>]
    //     );

    //     if (!isNA(xValue) && !isNA(yValue)) {
    //       const weight = roundTo(current[".influence_weight"] * 100, 3);

    //       accumulator.x.push(xValue);
    //       accumulator.y.push(yValue);

    //       const point: ApexDataPoint = {
    //         x: xValue,
    //         y: yValue,
    //         z: Math.PI * Math.pow(weight, 2),
    //         meta: { orig: current },
    //       };

    //       const actionFeature = dataset.actionFeatures[0];
    //       const actionValue =
    //         dataset.displayValue(actionFeature, current[actionFeature]) ??
    //         String(current[actionFeature]);
    //       if (!(actionValue in accumulator.categorizedSeries)) {
    //         accumulator.categorizedSeries[actionValue] = [];
    //       }
    //       accumulator.categorizedSeries[actionValue].push(point);
    //     }
    //     return accumulator;
    //   },
    //   { categorizedSeries: {}, x: [], y: [] }
    // );
    // Influence cases

    // @ts-expect-error poor typings...
    const element: HTMLElement = plot.el;
    const sizemin = 6;

    const influenceValues = influenceCases.reduce(
      (values, ic) => {
        const rawX = ic[featureX as string];
        const xValue = typeof rawX === "number" ? parseNA(rawX) : undefined;
        const rawY = ic[featureY as string];
        const yValue = typeof rawY === "number" ? parseNA(rawY) : undefined;
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
    const minimumDimension = Math.min(
      element.clientHeight,
      element.clientWidth
    );
    const maxSize = minimumDimension * 0.1;
    // A smaller sizeRef yields a bigger circle: e.g.
    // for a data value of 10, sizeref=10 would yield a circle of size 1,
    // but sizeref=1 would yield a circle of size 10.
    // The squaring is required if sizemode=area for obvious reasons.
    // The relative sizes of the circles to each other is z.
    // The absolute sizes are controlled by sizeref
    const sizeref = (2.0 * maxZ) / maxSize ** 2;

    const influenceData: Data = {
      name: "Influence case",
      x: influenceValues.x,
      y: influenceValues.y,
      z: influenceValues.z,
      type: "scatter",
      mode: "markers",
      marker: {
        size: influenceValues.z,
        sizeref,
        sizemin,
        sizemode: "area",
      },
      hovertemplate: `${featureX}: %{x:.3~f}<br />${featureY}: %{y:.3~f}<br />%{text}<extra></extra>`,
      text: influenceValues.text,
    };
    data.push(influenceData);

    // const predicted: ApexDataPoint[] = [];
    // if (isNA(predictionCase[xFeature]) || isNA(predictionCase[yFeature])) {
    //   // Always include at least one point, but use NaN
    //   predicted.push({ x: NaN, y: NaN, z: 1, meta: { orig: predictionCase } });
    // } else {
    //   const xValue = toRepresentation(xFeature, predictionCase[xFeature]);
    //   const yValue = toRepresentation(yFeature, predictionCase[yFeature]);
    //   predicted.push({
    //     x: xValue,
    //     y: yValue,
    //     z: 1,
    //     meta: { orig: predictionCase },
    //   });
    //   // Include test case in full value set
    //   x.push(xValue);
    //   y.push(yValue);
    // }

    if (predictionCase) {
      const predictedData: Data = {
        name: "Predicted value",
        x: [predictionCase[featureX as string]],
        y: [predictionCase[featureY as string]],
        type: "scatter",
        mode: "markers",
        marker: {
          size: maxSize,
          sizeref,
          sizemin,
          sizemode: "area",
        },
        hovertemplate: `${featureX}: %{x}<br />${featureY}: %{y}<br />Predicted<extra></extra>`,
      };
      data.push(predictedData);
    }

    // Build series objects
    // let paletteIndex = 1; // 0 is reserved for predicted case
    // for (const [key, values] of Object.entries(categorizedSeries)) {
    //   series.push({
    //     name: capitalizeFirst(key),
    //     data: values,
    //     color: chartPalette[paletteIndex],
    //   });
    //   paletteIndex++;
    //   if (paletteIndex >= chartPalette.length) paletteIndex = 1;
    // }
    // series.push({
    //   name: "Predicted",
    //   data: predicted,
    //   color: chartPalette[0],
    // });

    // const max = 200;
    // return [
    //   {
    //     x: features,
    //     y: features,
    //     zmin: min,
    //     zmax: max,
    //     type: "scatter",
    //   },
    // ];
    return data;
  }, [plot, featureX, featureY, idFeatures, influenceCases, predictionCase]);

  return (
    <Plot
      ref={setPlot}
      {...plotDefaults}
      {...props}
      data={data}
      layout={layout}
      config={plotDefaults.config}
    />
  );
}

// Convert value to numeric representation
// const toRepresentation = (
//   feature: FeatureName<T>,
//   v: T[FeatureName<T>]
// ): number => {
//   if (dataset.columns[feature].type === "continuous") {
//     return v as number;
//   } else {
//     const index = dataset.toAllowedIndex(feature, v);
//     if (index === -1) return NaN;
//     return index;
//   }
// };
