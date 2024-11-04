import type { Layout } from "plotly.js";
import { type PlotParams } from "react-plotly.js";

export type BaseVisualProps = {
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
  /** A name for the visual typically used in captions */
  name?: string;
};

export const plotDefaults: Partial<PlotParams> = {
  useResizeHandler: true,
  config: {
    responsive: true,
  },
};
