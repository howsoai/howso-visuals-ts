import type { Annotations, Layout, ScatterData, Shape } from "plotly.js";
import { type CSSProperties, type ReactNode, useMemo } from "react";
import { FormatCategoryTickTextParams } from "../..";
import { getColorScheme } from "../../colors";
import {
  type ScreenSizeHookProps,
  useLayoutDefaults,
  useSemanticColors,
} from "../../hooks";
import { type BaseVisualProps, plotDefaults } from "../BaseVisual";
// customizable method: use your own `Plotly` object as we're using a rebuild strict distribution
import createPlotlyComponent from "react-plotly.js/factory";
// @ts-expect-error
import Plotly from "plotly.js-strict-dist";
const Plot = createPlotlyComponent(Plotly);

export type FeaturesImportancesCategorizationProps = BaseVisualProps &
  ScreenSizeHookProps & {
    /** Scaled data */
    data:
      | {
          scaled_fc: Record<string, number>;
          scaled_mda: Record<string, number>;
        }
      | undefined;
    className?: string;
    formatParams?: Omit<FormatCategoryTickTextParams, "wrap">;
    style?: CSSProperties;
  };

/**
 * Displays feature importances.
 * This method is designed to work with HowsoInsights.categorize_feature_importances data.
 *
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=20-116&mode=design&t=EAIu2Lqzf3bekOkQ-4
 */
export const FeaturesImportancesCategorization = ({
  data,
  formatParams,
  isDark,
  isPrint,
  isLoading,
  layout: layoutProp,
  name = "Feature importance categorization",
  screenSizes,
  ...props
}: FeaturesImportancesCategorizationProps): ReactNode => {
  const colorScheme = getColorScheme({ isDark, isPrint });
  const semanticColors = useSemanticColors({ colorScheme });

  // Create layout
  const layoutDefaults = useLayoutDefaults({ colorScheme });
  const layout = useMemo((): Partial<Layout> => {
    const lineDefaults: Partial<Shape> = {
      type: "line",
      yref: "paper",
      line: {
        color: semanticColors.divider,
        width: 1.5,
        dash: "dot",
      },
    };
    const quadrantAnnotationDefaults: Partial<Annotations> = {
      showarrow: false,
      font: { size: 16 },
    };
    return {
      ...layoutDefaults,
      showlegend: false,
      xaxis: {
        ...layoutDefaults.xaxis,
        title: { text: "Scaled contribution", standoff: 5 },
        ...layoutProp?.xaxis,
        tickcolor: "transparent",
        automargin: true,
        showgrid: false,
        showticklabels: false,
        zeroline: false,
        range: [-0.15, 1.15],
      },
      yaxis: {
        ...layoutDefaults.yaxis,
        title: { text: "Scaled MDA", standoff: 5 },
        tickcolor: "transparent",
        ...layoutProp?.yaxis,
        showgrid: false,
        showticklabels: false,
        zeroline: false,
        range: [-1.15, 1.15],
      },
      shapes: [
        {
          ...lineDefaults,
          x0: 0,
          y0: 0.5,
          x1: 1,
          y1: 0.5,
        },
        {
          ...lineDefaults,
          x0: 0.5,
          y0: 0,
          x1: 0.5,
          y1: 1,
        },
      ],
      annotations: [
        {
          ...quadrantAnnotationDefaults,
          x: 0.25,
          y: 0.5,
          text: "Reduces uncertainty",
          font: {
            ...quadrantAnnotationDefaults.font,
            color: semanticColors.secondary,
          },
        },
        {
          ...quadrantAnnotationDefaults,
          x: 0.25,
          y: -0.5,
          text: "Unimportant",
        },
        {
          ...quadrantAnnotationDefaults,
          x: 0.75,
          y: 0.5,
          text: "Important",
          font: {
            ...quadrantAnnotationDefaults.font,
            color: semanticColors.primary,
          },
        },
        {
          ...quadrantAnnotationDefaults,
          x: 0.75,
          y: -0.5,
          text: "Influential, does not reduce uncertainty",
          font: {
            ...quadrantAnnotationDefaults.font,
            color: semanticColors.secondary,
          },
        },
      ],
      margin: {
        pad: 0,
        t: 0,
      },
      ...layoutProp,
    };
  }, [layoutDefaults, semanticColors.divider, layoutProp]);

  // Create data
  const plotlyData = useMemo((): ScatterData[] => {
    const scatterDataDefaults = {
      type: "scatter",
      mode: "markers",
      marker: { size: 15 },
      textposition: "top center",
    } as ScatterData;

    // Provide loading data
    if (isLoading) {
      return [
        {
          ...new Array(15).fill(0).reduce(
            (data, _, index) => {
              const value = 1 / index;
              data.x.push(value);
              data.y.push(value * (index % 3 ? -1 : 1));
              return data;
            },
            {
              ...scatterDataDefaults,
              marker: {
                ...scatterDataDefaults.marker,
                size: 20,
                color: semanticColors.divider,
              },
              x: [],
              y: [],
            } as ScatterData
          ),
        },
      ];
    }

    // Create grouped bundles

    const features = Object.keys(data?.scaled_fc || {});

    const getCategoryDataDefaults = (
      scatterData: Partial<Omit<ScatterData, "text" | "x" | "y">>
    ): Required<Partial<ScatterData>> => ({
      ...scatterDataDefaults,
      marker: {
        ...scatterDataDefaults.marker,
        ...scatterData.marker,
      },
      text: [],
      x: [],
      y: [],
      hovertemplate:
        "<b>%{text}</b><br />%{xaxis.title.text}: %{x:.4~f}<br />%{yaxis.title.text}: %{y:.4~f}<extra></extra>",
      ...scatterData,
    });
    const categories = features.reduce(
      (categories, feature) => {
        const contribution = data?.scaled_fc[feature];
        const mda = data?.scaled_mda[feature];
        if (typeof contribution !== "number" || typeof mda !== "number") {
          return categories;
        }

        const category = getCategory(contribution, mda);
        (categories[category].text as string[]).push(feature);
        (categories[category].x as number[]).push(contribution);
        (categories[category].y as number[]).push(mda);
        return categories;
      },
      {
        reduces: getCategoryDataDefaults({
          marker: { color: semanticColors.secondary, size: 15 },
          name: "Reduces uncertainty",
        }),
        important: getCategoryDataDefaults({
          marker: { color: semanticColors.primary, size: 12 },
          name: "Important",
        }),
        unimportant: getCategoryDataDefaults({
          marker: { color: semanticColors.divider, size: 10 },
          name: "Unimportant",
        }),
        influential: getCategoryDataDefaults({
          marker: { color: semanticColors.secondary, size: 15 },
          name: "Influential, does not reduce uncertainty",
        }),
      } satisfies Categories
    );
    return Object.values(categories);
  }, [semanticColors, isLoading, data]);

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

type Categories = {
  reduces: ScatterData;
  important: ScatterData;
  unimportant: ScatterData;
  influential: ScatterData;
};
const getCategory = (contribution: number, mda: number): keyof Categories => {
  switch (true) {
    case contribution < 0.5 && mda >= 0:
      return "reduces";
    case contribution >= 0.5 && mda >= 0:
      return "important";
    case contribution < 0.5 && mda < 0:
      return "unimportant";
    default:
      return "influential";
  }
};
