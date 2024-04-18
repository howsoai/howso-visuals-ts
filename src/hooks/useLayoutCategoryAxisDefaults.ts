import type { LayoutAxis } from "plotly.js";
import { useMemo } from "react";
import { ScreenSizes, useIsLgUp, useIsMdUp, useIsSmUp } from "./useScreenSize";
import {
  FormatCategoryTickTextParams,
  formatCategoryTickText,
} from "../utils/formatting";

export type UseLayoutCategoryAxisDefaultsParams = Omit<
  GetLayoutCategoryAxisDefaultsParams,
  "isSmUp" | "isMdUp" | "isLgUp"
> & {
  screenSizes?: ScreenSizes;
};
/**
 * Provides tick properties and category label formatting.
 * This hook is relatively expensive, ensure it's arguments are memoized.
 */
export const useLayoutCategoryAxisDefaults = ({
  screenSizes,
  ...params
}: UseLayoutCategoryAxisDefaultsParams): Partial<LayoutAxis> => {
  const isSmUp = useIsSmUp(screenSizes);
  const isMdUp = useIsMdUp(screenSizes);
  const isLgUp = useIsLgUp(screenSizes);

  const layoutDefaults = useMemo(
    () => getLayoutCategoryAxisDefaults({ ...params, isSmUp, isMdUp, isLgUp }),
    [params, isSmUp, isMdUp, isLgUp]
  );

  return layoutDefaults;
};

export type GetLayoutCategoryAxisDefaultsParams = {
  categories: string[];
  formatParams?: FormatCategoryTickTextParams;
  isSmUp: boolean;
  isMdUp: boolean;
  isLgUp: boolean;
};
/** A direct utility for getting defaults. For ease, you may prefer useLayoutDefaults. */
export const getLayoutCategoryAxisDefaults = ({
  categories,
  formatParams,
  isSmUp,
  isMdUp,
  isLgUp,
}: GetLayoutCategoryAxisDefaultsParams): Partial<LayoutAxis> => {
  const getWrap = () => {
    switch (true) {
      case isLgUp:
        return categories.length <= 25;
      case isMdUp:
        return categories.length <= 20;
      case isSmUp:
        return categories.length <= 10;
      default:
        return undefined;
    }
  };

  const { ticktext, tickvals } = categories.reduce(
    ({ ticktext, tickvals }, category, index) => {
      ticktext.push(
        formatCategoryTickText(category, { ...formatParams, wrap: getWrap() })
      );
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
