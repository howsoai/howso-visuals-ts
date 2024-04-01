import { useMemo, type CSSProperties, ReactNode } from "react";
import Plot from "react-plotly.js";
import { BaseChartProps, layoutFont as layoutFontDefaults } from "..";
import { ColorScheme, SemanticColors } from "../../colors";

export interface DesirabilityPops extends BaseChartProps {
  value: number;
  color?: ColorScheme;
  divider?: ColorScheme;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function Desirability({
  className,
  value,
  label,
  isDark,
  isPrint,
  layout: layoutProp,
  color = SemanticColors.primary,
  divider = SemanticColors.divider,
  ...props
}: DesirabilityPops): ReactNode {
  const { layout, data } = useMemo(() => {
    const _isDark = !isPrint && isDark;
    const bgColor = _isDark ? divider.dark["400"] : divider.dark["200"];
    const fillColor = _isDark ? color.dark["700"] : color.light["600"];
    const fontColor = _isDark ? divider.dark["200"] : divider.light["900"];
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
          bar: { thickness: 1, color: fillColor },
          bgcolor: bgColor,
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
  }, [isDark, isPrint, color, value, label, layoutProp]);

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
