import { CSSProperties, ReactNode, useMemo } from "react";
import { getColorScheme, Blue, Purple, Orange, Green } from "../../colors";
import { useLayoutDefaults } from "../../hooks";
import { BaseVisualProps, plotDefaults } from "../BaseVisual";
import { Layout, Data, ScatterMarkerLine } from "plotly.js";
import Plot from "react-plotly.js";
import {
  isNA,
  parseNA,
  safeMax,
  safeMin,
  KERNELS,
  kernelDensityEstimator,
} from "../..";
import { extent, range } from "d3-array";
import { Case } from "../../types";

export type InfluentialCasesProps = BaseVisualProps & {
  /** The actual value from react */
  actualValue?: number;
  className?: string;
  /**
   * An optional list of values for the action feature to visualize. This will be used to visualize a
        KDE plot to characterize the distribution of values around the predicted and actual values. If this is None,
        the distribution of influential cases in the react will be used instead, if present.
   *
   * Using a reaction loop of 100+ to generate a spread using an actual test case is also possible.
   *   Demonstrating for predictions like a
   *   See:
   * ```python
   * gen_reacts = list()
   * for i in range(0,100):
   *    result =  trainee.react(context_features=context_features,
   *                            action_features=action_feature,
   *                            contexts=[context_values],
   *                            desired_conviction = 5000)
   *    gen_reacts.append(result['action'].loc[0, 'moid'])
   * ```
   **/
  densityValues?: number[];
  /**
   * If provided the x ranges will be expanded by this value to allow for that uncertainty.
   * If not supplied predictedUncertainty will be used as a fallback.
   * See stats.mae
   **/
  densityUncertainty?: number | undefined | null;
  feature: string;
  /**
   * A list of features which uniquely identify an influence case.
   * These will be used in hover states for influence cases.
   * If not supplied the internal `.session` and `.training_session_index` value will be used.
   **/
  idFeatures?: string[];
  /** response.content?.boundary_cases?.[0] ?? []; */
  influenceCases: Case[];
  predictionCase: Case;
  /**
   * Draws a prediction's dot above the density.
   * Usually obtained through react for action features.
   **/
  predictedValue: number;
  /**
   * Draws a prediction value's uncertainty values, also known as residuals.
   * Using global feature stats.mae value will explain the average across the whole data set,
   *   that predictions should be within those bars 50% of the time.
   *   See: await getGlobalFeatureStats<DatasetCase>(cl, trainee, DATASET.actionFeatures[0]).mae;
   * Using a local value will explain for a specific test case,
   *   you should see the prediction within the bars 50% of the time.
   *   See: react['details']['feature_residuals'][0][action_feature[0]]
   **/
  predictedUncertainty?: number;
  style?: CSSProperties;
};

/**
 * Displays a prediction with additional information for interpreting the result.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=54-1354
 * @see https://plotly.com/javascript/line-and-scatter/
 * @see https://plotly.com/javascript/filled-area-plots/
 * @see https://plotly.com/javascript/reference/scatter/
 * @see https://plotly.com/javascript/multiple-axes/
 */
export function InfluentialCases({
  actualValue,
  densityValues,
  densityUncertainty,
  feature,
  idFeatures,
  influenceCases,
  isDark,
  isPrint,
  layout: layoutProp,
  predictionCase,
  predictedValue,
  predictedUncertainty,
  ...props
}: InfluentialCasesProps): ReactNode {
  const colorScheme = getColorScheme({ isDark, isPrint });

  // Create layout
  const layoutDefaults = useLayoutDefaults({ colorScheme });

  const layout = useMemo((): Partial<Layout> => {
    return {
      ...layoutDefaults,
      ...layoutProp,
      xaxis: {
        ...layoutDefaults.xaxis,
        ...layoutProp?.xaxis,
        title: {
          text: feature,
        },
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        ...layoutProp?.yaxis,
        title: "Density",
        hoverformat: ".4f",
      },
      yaxis2: {
        ...layoutDefaults.yaxis,
        ...layoutProp?.yaxis,
        title: "Influence weight (%)",
        overlaying: "y",
        side: "right",
        zeroline: false,
        gridcolor: "transparent",
        hoverformat: ".4f",
      },
      legend: {
        yanchor: "top",
        y: 0.99,
        xanchor: "right",
        x: 0.99,
      },
    };
  }, [layoutDefaults, layoutProp, feature]);

  // Create data
  const data = useMemo((): Data[] => {
    const data: Data[] = [];
    const maxInfluenceWeight = getMaximumInfluenceWeight({ influenceCases });
    const testValue = predictionCase[feature] as number;
    const isTestValueNaN = isNA(testValue);
    // const isInteger = false; // TODO maybe?
    // const mae = isInteger ? Math.ceil(rawMae) : rawMae;
    const markerLine: Partial<ScatterMarkerLine> = {
      width: 1,
      color: colorScheme === "dark" ? "#fff" : "#000",
    };

    const xStats = getXStats({
      feature,
      values: densityValues,
      influenceCases,
      isTestValueNaN,
      testValue,
      uncertainty: densityUncertainty || predictedUncertainty,
    });

    if (predictedValue) {
      const predictedValueData: Data = {
        name: "Predicted value",
        x: [predictedValue],
        y: [maxInfluenceWeight * valuesYOffset],
        yaxis: "y2",
        type: "scatter",
        mode: "markers",
        marker: {
          size: 15,
          color: Purple[colorScheme]["900"],
          line: markerLine,
        },
        hovertemplate: "Predicted: %{x}<br />Influence: N/A<extra></extra>",
        error_x:
          typeof predictedUncertainty === "number"
            ? { type: "constant", value: predictedUncertainty }
            : undefined,
      };
      data.push(predictedValueData);
    }

    if (actualValue) {
      const actualValueData: Data = {
        name: "Actual value",
        x: [actualValue],
        y: [maxInfluenceWeight * valuesYOffset],
        yaxis: "y2",
        type: "scatter",
        mode: "markers",
        marker: {
          size: 15,
          color: Orange[colorScheme]["900"],
          line: markerLine,
        },
        hovertemplate: "Value: %{x}<br />Influence: N/A<extra></extra>",
      };
      data.push(actualValueData);
    }

    // Influence cases
    if (influenceCases) {
      const influenceValues = influenceCases.reduce(
        (values, ic) => {
          const rawX = ic[feature];
          const xValue = typeof rawX === "number" ? parseNA(rawX) : undefined;
          const rawY = ic[".influence_weight"];
          const yValue = typeof rawY === "number" ? parseNA(rawY) : undefined;

          if (xValue === undefined || yValue === undefined) {
            return values;
          }

          values.x.push(xValue);
          values.y.push(yValue);
          values.text.push(getInfluenceCaseText({ ic, idFeatures }));
          return values;
        },
        { x: [], y: [], text: [] } as {
          x: number[];
          y: number[];
          text: string[];
        }
      );

      const influenceData: Data = {
        name: "Influence case",
        x: influenceValues.x,
        y: influenceValues.y,
        yaxis: "y2",
        type: "scatter",
        mode: "markers",
        marker: {
          size: 15,
          color: Green[colorScheme]["900"],
          line: markerLine,
        },
        hovertemplate:
          "Value: %{x}<br />Influence: %{y}%<br />%{text}<extra></extra>",
        text: influenceValues.text,
      };
      data.push(influenceData);
    }

    // Density
    const density = getDensity(xStats);
    if (density.x.length) {
      const densityData: Data = {
        name: "Density",
        x: density.x,
        y: density.y,
        type: "scatter",
        mode: "lines",
        fill: "tozeroy",
        hoverinfo: "skip",
        line: {
          color: Blue[colorScheme]["900"],
          shape: "spline",
        },
        opacity: 0.2,
      };
      data.push(densityData);
    }

    return data;
  }, [
    actualValue,
    colorScheme,
    densityValues,
    densityUncertainty,
    feature,
    idFeatures,
    influenceCases,
    predictionCase,
    predictedValue,
    predictedUncertainty,
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

const valuesYOffset = 1.05;

type MaximumInfluenceWeightParams = Pick<
  InfluentialCasesProps,
  "influenceCases"
>;
const getMaximumInfluenceWeight = ({
  influenceCases,
}: MaximumInfluenceWeightParams): number => {
  if (!influenceCases) {
    return 0;
  }
  return Math.max(
    ...influenceCases.map((ic) => {
      const value = ic[".influence_weight"];
      return typeof value === "number" ? parseNA(value) : 0;
    })
  );
};

type XValuesParams = {
  isTestValueNaN: boolean;
  /** Mean absolute error */
  uncertainty?: number | null;
  testValue: number;
  values?: number[];
} & Pick<InfluentialCasesProps, "feature" | "influenceCases">;
type XStats = {
  min: number;
  max: number;
  delta: number;
  totalMin: number;
  totalMax: number;
  /*
   * The x values to be displayed.
   * If values are not supplied, they will be extracted from influenceCases[feature].
   * Uncertainty will be applied to the standardized values creating the statistics
   **/
  values: number[];
};
const getXStats = ({
  feature,
  influenceCases,
  isTestValueNaN,
  uncertainty,
  testValue,
  values,
}: XValuesParams): XStats => {
  const standardizedUncertainty =
    typeof uncertainty === "number" ? uncertainty : 0;

  const standardizedValues = values
    ? (values.filter((ic) => !isNA(ic)) as number[])
    : (influenceCases
        .map((ic) => ic[feature])
        .filter((ic) => !isNA(ic)) as number[]);

  const [min = 0, max = 0] = extent(standardizedValues);
  const delta = safeMax(
    1,
    (safeMax(max, testValue + standardizedUncertainty) -
      safeMin(min, testValue - standardizedUncertainty)) /
      10
  );

  if (isTestValueNaN) {
    const totalMin = safeMax(0, min - delta);
    const totalMax = max + delta;
    return {
      min: min,
      max: max,
      delta: delta,
      totalMin,
      totalMax,
      values: standardizedValues,
    };
  }

  const totalMin = safeMax(
    0,
    safeMin(testValue - standardizedUncertainty - delta, min - delta)
  );

  const totalMax = safeMax(
    testValue + standardizedUncertainty + delta,
    max + delta
  );
  return {
    min,
    max,
    delta,
    totalMin,
    totalMax,
    values: standardizedValues,
  };
};

const getDensity = (xStats: XStats): { x: number[]; y: number[] } => {
  const startDensity = xStats.totalMin;
  const stopDensity = xStats.totalMax;
  const totalDelta = stopDensity - startDensity;
  const increment = totalDelta / xStats.values.length;
  const ticks = range(startDensity, stopDensity, increment);
  if (ticks[ticks.length - 1] < xStats.totalMax) ticks.push(xStats.totalMax); // ensure max is in ticks

  const estimator = kernelDensityEstimator(
    KERNELS.epanechnikov(increment),
    ticks
  );
  const densityEstimation = estimator(xStats.values);
  const values = densityEstimation.reduce(
    (values, [x, y], index) => {
      values.firstNonZeroIndex ||= y > 0 ? index : undefined;

      if (
        y > 0 &&
        (values.lastNonZeroIndex === undefined ||
          values.lastNonZeroIndex < index)
      ) {
        values.lastNonZeroIndex = index;
      }

      values.x.push(x);
      values.y.push(y);
      return values;
    },
    {
      x: [],
      y: [],
      firstNonZeroIndex: undefined,
      lastNonZeroIndex: undefined,
    } as {
      x: number[];
      y: number[];
      firstNonZeroIndex: undefined | number;
      lastNonZeroIndex: undefined | number;
    }
  );

  const startIndex = Math.max(
    0,
    values.firstNonZeroIndex ? values.firstNonZeroIndex - 1 : 0
  );
  const endIndex = values.lastNonZeroIndex
    ? values.lastNonZeroIndex + 2
    : undefined;

  return {
    x: values.x.slice(startIndex, endIndex),
    y: values.y.slice(startIndex, endIndex),
  };
};

type InfluenceCaseTextParams = Pick<InfluentialCasesProps, "idFeatures"> & {
  ic: Case;
};
const getInfluenceCaseText = ({
  ic,
  idFeatures,
}: InfluenceCaseTextParams): string => {
  if (!idFeatures?.length) {
    return `Ids: session: ${ic[".session"]}, index: ${ic[".session_training_index"]}`;
  }

  const prefix = idFeatures.length > 0 ? "Ids" : "Id";
  return (
    `${prefix}: ` +
    idFeatures
      .map((feature) => `${feature}: ${ic[feature] || "null"}`)
      .join(", ")
  );
};
