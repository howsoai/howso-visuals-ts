import { useMemo } from "react";
import { Case, IdFeaturesProps } from "../types";

type CaseLabelParams = IdFeaturesProps & {
  case: Case;
};

export const useCaseLabel = (props: CaseLabelParams): string => {
  return useMemo(() => getCaseLabel(props), [props]);
};

export const getCaseLabel = (props: CaseLabelParams): string => {
  if (!props.idFeatures?.length) {
    return `Ids: session: ${props.case[".session"]}, index: ${props.case[".session_training_index"]}`;
  }

  const prefix = props.idFeatures.length > 0 ? "Ids" : "Id";
  return (
    `${prefix}: ` +
    props.idFeatures
      .map(
        (feature) =>
          `${feature}: ${
            ["number", "string"].includes(typeof props.case[feature])
              ? props.case[feature]
              : "null"
          }`
      )
      .join(", ")
  );
};
