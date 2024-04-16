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

export type InfluentialCasesProps = BaseVisualProps & {
  /** The actual value from react */
  actualValue?: number;
  className?: string;
  feature: string;
  /**
   * A list of features which uniquely identify an influence case.
   * These will be used in hover states for influence cases.
   * If not supplied the internal `.training_session_index` value will be used.
   **/
  idFeatures?: string[];
  /** response.content?.boundary_cases?.[0] ?? []; */
  influenceCases: Record<string, string | number | null>[];
  predictionCase: Record<string, string | number | null>;
  predictedValue: number;
  /** stats.mae */
  mae?: number | undefined | null;
  /** react['details']['feature_residuals'][0][action_feature[0]] */
  residual?: number;
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
  feature,
  idFeatures,
  influenceCases,
  isDark,
  isPrint,
  layout: layoutProp,
  predictionCase,
  predictedValue,
  residual,
  mae,
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
      //   annotations,
      // legend: {},
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

    const xStats = getXValues({
      feature,
      influenceCases,
      isTestValueNaN,
      mae: mae || 0,
      testValue,
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
        error_x: !residual ? undefined : { type: "constant", value: residual },
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
    if (xStats.xDelta) {
      const increment = Math.ceil((xStats.totalMax - xStats.totalMin) / 10);
      const ticks = range(xStats.totalMin, xStats.totalMax, increment);
      if (ticks[ticks.length - 1] < xStats.totalMax)
        ticks.push(xStats.totalMax); // ensure max is in ticks
      const kde = kernelDensityEstimator(
        KERNELS.epanechnikov(increment),
        ticks
      );
      const density = kde(xStats.values).reduce(
        (values, [x, y]) => {
          values.x.push(x);
          values.y.push(y); // TODO Round to 6 you say...?
          return values;
        },
        { x: [], y: [] } as { x: number[]; y: number[] }
      );

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
    feature,
    idFeatures,
    influenceCases,
    mae,
    predictionCase,
    predictedValue,
    residual,
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
  mae: number;
  testValue: number;
} & Pick<InfluentialCasesProps, "feature" | "influenceCases">;
type XValues = {
  xMin: number;
  xMax: number;
  xDelta: number;
  totalMin: number;
  totalMax: number;
  /* The x value from all influence cases */
  values: number[];
};
const getXValues = ({
  feature,
  influenceCases,
  isTestValueNaN,
  mae,
  testValue,
}: XValuesParams): XValues => {
  const xValues = !influenceCases
    ? []
    : (influenceCases
        .map((ic) => ic[feature])
        .filter((ic) => !isNA(ic)) as number[]);
  const [xMin = 0, xMax = 0] = extent(xValues);
  const xDelta = safeMax(
    1,
    (safeMax(xMax, testValue + mae) - safeMin(xMin, testValue - mae)) / 10
  );

  if (isTestValueNaN) {
    const totalMin = safeMax(0, xMin - xDelta);
    const totalMax = xMax + xDelta;
    return {
      xMin,
      xMax,
      xDelta,
      totalMin,
      totalMax,
      values: xValues,
    };
  }

  const totalMin = safeMax(0, safeMin(testValue - mae - xDelta, xMin - xDelta));
  const totalMax = safeMax(testValue + mae + xDelta, xMax + xDelta);
  return {
    xMin,
    xMax,
    xDelta,
    totalMin,
    totalMax,
    values: xValues,
  };
};

type InfluenceCaseTextParams = Pick<InfluentialCasesProps, "idFeatures"> & {
  ic: Record<string, string | number | null>;
};
const getInfluenceCaseText = ({
  ic,
  idFeatures,
}: InfluenceCaseTextParams): string => {
  if (!idFeatures?.length) {
    return `Case: ${ic[".session"]}:${ic[".training_session_index"]}`;
  }

  const prefix = idFeatures.length > 0 ? "Ids" : "Id";
  return (
    `${prefix}: ` +
    idFeatures
      .map((feature) => `${feature}: ${ic[feature] || "null"}`)
      .join(", ")
  );
};
