import type { LayoutAxis } from "plotly.js";
import { useMemo } from "react";
import { formatCategoryTickText } from "..";

/**
 * Provides tick properties and category label formatting.
 * This hook is relatively expensive, ensure it's arguments are memoized.
 */
export const useLayoutCategoryAxisDefaults = (
  params: UseLayoutCategoryAxisDefaultsParams
): Partial<LayoutAxis> => {
  const layoutDefaults = useMemo(
    () => getLayoutCategoryAxisDefaults(params),
    [params]
  );

  return layoutDefaults;
};

export type UseLayoutCategoryAxisDefaultsParams = {
  categories: string[];
};
/** A direct utility for getting defaults. For ease, you may prefer useLayoutDefaults. */
export const getLayoutCategoryAxisDefaults = ({
  categories,
}: UseLayoutCategoryAxisDefaultsParams): Partial<LayoutAxis> => {
  const { ticktext, tickvals } = categories.reduce(
    ({ ticktext, tickvals }, category, index) => {
      ticktext.push(formatCategoryTickText(category));
      tickvals.push(index);
      return { ticktext, tickvals };
    },
    { ticktext: [] as string[], tickvals: [] as any[] }
  );

  return {
    ticktext,
    tickvals,
    tickmode: "array",
  };
};
