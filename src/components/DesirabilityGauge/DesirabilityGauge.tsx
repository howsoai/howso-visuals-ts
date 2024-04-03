import { useMemo, type CSSProperties, ReactNode } from "react";
import Plot from "react-plotly.js";
import { BaseChartProps, layoutFont as layoutFontDefaults } from "..";
import { ColorShade, SemanticColors } from "../../colors";

// See https://www.figma.com/file/uipiKBGe2ma0EGfkioXdF2/Howso-Visuals?type=design&node-id=20-10&mode=design&t=GEwaik02j7zxUBbx-4

export interface DesirabilityGaugeProps extends BaseChartProps {
  value: number;
  /**
   * Provides the gauge's fill color if provided.
   * Default: Scheme and print aware semantic primary.
   */
  color?: ColorShade;
  /**
   * Provides the gauge's background color if provided.
   * Default: Scheme and print aware semantic divider.
   */
  background?: ColorShade;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function DesirabilityGauge({
  className,
  value,
  label,
  isDark: isDarkProp,
  isPrint,
  layout: layoutProp,
  color: colorProp,
  background: backgroundProp,
  ...props
}: DesirabilityGaugeProps): ReactNode {
  const isDark = !isPrint && isDarkProp;
  const color =
    colorProp || SemanticColors.primary[isDark ? "dark" : "light"]["900"];
  const background = backgroundProp
    ? backgroundProp
    : isDark
    ? SemanticColors.divider.light["400"]
    : SemanticColors.divider.dark["300"];

  const { layout, data } = useMemo(() => {
    const fontColor = isDark ? "#fff" : "#000";
    const tickvals = [value];
    // Prevent label overlay
    if (value >= 0.2) tickvals.unshift(0);
    if (value <= 4.8) tickvals.push(5);

    const data: Plotly.Data[] = [
      {
        type: "indicator",
        mode: "gauge",
        value: value,
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
    const layout: Partial<Plotly.Layout> = {
      paper_bgcolor: "transparent",
      autosize: true,
      ...layoutProp,
      font: { ...layoutFontDefaults, ...layoutProp?.font, color: fontColor },
    };
    if (label) {
      layout.annotations = [
        {
          xref: "paper",
          yref: "paper",
          x: 0.5,
          y: 0.25,
          text: label,
          showarrow: false,
          font: {
            size: 12,
          },
        },
      ];
    }

    return { layout, data };
  }, [isDark, color, background, value, label, layoutProp]);

  return (
    <Plot
      {...props}
      className={className}
      useResizeHandler
      data={data}
      layout={layout}
      config={{
        responsive: true,
        displayModeBar: false,
      }}
    />
  );
}
