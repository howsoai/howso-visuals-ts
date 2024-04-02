import { type Layout } from "plotly.js";

export type BaseChartProps = {
  isLoading?: boolean;
  isDark?: boolean;
  isPrint?: boolean;
  /**
   * Optional Layout properties to apply.
   * These will be mixed with package defaults.
   * You *must* ensure the layout object is unchanged through render cycles.
   * We suggest a constant outside of your component or useMemo() if dynamic data is required.
   *  */
  layout?: Partial<Layout>;
};

export const layoutFont: Layout["font"] = {
  family: "Inter, system-ui, sans-serif",
};
