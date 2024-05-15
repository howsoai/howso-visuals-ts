import { useMemo } from "react";

type DataMeta = {
  isCategorical: boolean;
  categories?: string[];
};
export const useDataMeta = (values: (string | number)[]): DataMeta =>
  useMemo((): DataMeta => getDataMeta(values), [values]);

export const getDataMeta = (values: (string | number)[]): DataMeta => {
  const isCategorical = values.some((value) => typeof value !== "number");
  const meta: DataMeta = { isCategorical };
  if (isCategorical) {
    meta.categories = values as string[];
  }
  return meta;
};
