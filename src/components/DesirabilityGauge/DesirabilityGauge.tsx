import { useMemo, type CSSProperties, ReactNode } from "react";
import Plot from "react-plotly.js";
import { getColorScheme } from "../../colors";
import { useLayoutDefaults, useSemanticColors } from "../../hooks";
import { BaseVisualProps, plotDefaults } from "../BaseVisual";

export interface DesirabilityGaugeProps extends BaseVisualProps {
  value: number;
  /**
   * Provides the gauge's fill color if provided.
   * Default: Scheme and print aware semantic primary.
   */
  color?: string;
  /**
   * Provides the gauge's background color if provided.
   * Default: Scheme and print aware semantic divider.
   */
  background?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * @see https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=20-10&mode=design&t=GEwaik02j7zxUBbx-4
 *
 * TODO Scale of the label feels off.
 */
export function DesirabilityGauge({
  value,
  name = "Desirability",
  isDark: isDarkProp,
  isPrint,
  layout: layoutProp,
  color: colorProp,
  background: backgroundProp,
  ...props
}: DesirabilityGaugeProps): ReactNode {
  // Create the layout
  const colorScheme = getColorScheme({ isDark: isDarkProp, isPrint });
  const semanticColors = useSemanticColors({ colorScheme });
  const color = colorProp || semanticColors.primary;
  const background = backgroundProp ? backgroundProp : semanticColors.divider;

  const layoutDefaults = useLayoutDefaults({ colorScheme });
  const layout = useMemo((): Partial<Plotly.Layout> => {
    const layout: Partial<Plotly.Layout> = {
      ...layoutDefaults,
      ...layoutProp,
      font: { ...layoutDefaults.font, ...layoutProp?.font },
    };
    if (name) {
      layout.annotations = [
        {
          xref: "paper",
          yref: "paper",
          x: 0.5,
          y: 0.25,
          text: name,
          showarrow: false,
          font: {
            size: 12,
          },
        },
      ];
    }

    return layout;
  }, [name, layoutDefaults, layoutProp]);

  // Create the data
  const data = useMemo((): Plotly.Data[] => {
    const tickvals = [value];
    // Prevent label overlay
    if (value >= 0.2) tickvals.unshift(0);
    if (value <= 4.8) tickvals.push(5);

    return [
      {
        type: "indicator",
        mode: "gauge",
        value,
        gauge: {
          axis: {
            range: [null, 5],
            tickvals,
            ticks: "",
            tickangle: 0,
            tickformat: ".2~f", // show up to 2 decimals
            tickfont: { size: 14 },
          },
          bar: { thickness: 1, color },
          bgcolor: background,
          borderwidth: 0,
        },
      },
    ];
  }, [value, background, color]);

  // Create the config
  const config = useMemo(
    () => ({
      ...plotDefaults.config,
      displayModeBar: false,
    }),
    []
  );

  return (
    <Plot
      {...plotDefaults}
      {...props}
      data={data}
      layout={layout}
      config={config}
    />
  );
}
