import type { Data, Layout } from "plotly.js";
import { CSSProperties, ReactNode, useMemo } from "react";
import { getColorScheme } from "../../colors";
import {
  getCaseLabel,
  useLayoutDefaults,
  useSemanticColors,
} from "../../hooks";
import { IdFeaturesProps } from "../../types";
import { parseNA } from "../../utils";
import { BaseVisualProps, plotDefaults } from "../BaseVisual";
// customizable method: use your own `Plotly` object as we're using a rebuild strict distribution
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-expect-error
import Plotly from "plotly.js-strict-dist";
const Plot = createPlotlyComponent(Plotly);

export type SimilarityConvictionCase = {
  similarity_conviction: number | null;
} & Record<string, unknown>;
export type SimilarityConvictionProps = BaseVisualProps &
  IdFeaturesProps & {
    cases: SimilarityConvictionCase[] | undefined;
    style?: CSSProperties;
  };

/**
 * @see https://plotly.com/javascript/line-and-scatter/
 * @see https://plotly.com/javascript/filled-area-plots/
 * @see https://plotly.com/javascript/reference/scatter/
 */
export function SimilarityConviction({
  cases,
  idFeatures,
  isDark,
  isPrint,
  layout: layoutProp,
  ...props
}: SimilarityConvictionProps): ReactNode {
  const colorScheme = getColorScheme({ isDark, isPrint });
  const semanticColors = useSemanticColors({ colorScheme });

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
          text: "Index",
        },
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        ...layoutProp?.yaxis,
        title: "Conviction",
        hoverformat: ".4f",
      },
    };
  }, [layoutDefaults, layoutProp]);

  // Create data
  const data = useMemo((): Data[] => {
    const data: Data[] = [];

    if (cases) {
      const points = cases.reduce(
        (values, _case, index) => {
          const rawY = _case.similarity_conviction;
          const yValue = typeof rawY === "number" ? parseNA(rawY) : undefined;
          if (yValue === undefined) {
            return values;
          }

          values.x.push(index);
          values.y.push(yValue);
          values.text.push(getCaseLabel({ case: _case, idFeatures }));
          return values;
        },
        { x: [], y: [], text: [] } as {
          x: number[];
          y: number[];
          text: string[];
        }
      );

      const influenceData: Data = {
        name: "Cases",
        x: points.x,
        y: points.y,
        type: "scatter",
        line: {
          color: semanticColors.primary,
          shape: "spline",
        },
        // marker: {
        //   size: 15,
        //   color: ,
        //   line: markerLine,
        // },
        hovertemplate:
          "Value: %{y}<br />Index: %{x}%<br />%{text}<extra></extra>",
        text: points.text,
      };
      data.push(influenceData);
    }

    // Drift visualization
    // const density = getDensity(xStats);
    // if (density.x.length) {
    //   const densityData: Data = {
    //     name: "Density",
    //     x: density.x,
    //     y: density.y,
    //     type: "scatter",
    //     mode: "lines",
    //     fill: "tozeroy",
    //     hoverinfo: "skip",
    //     line: {
    //       color: ChartColors.Blue[colorShade],
    //       shape: "spline",
    //     },
    //     opacity: 0.2,
    //   };
    //   data.push(densityData);
    // }

    return data;
  }, [semanticColors, idFeatures, cases]);

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
