import { useMemo } from "react";
import {
  SemanticColorsParams,
  SemanticColors,
  getSemanticColors,
} from "../colors";

export const useSemanticColors = (
  params: SemanticColorsParams
): SemanticColors => {
  const semanticColors = useMemo(() => getSemanticColors(params), [params]);

  return semanticColors;
};
