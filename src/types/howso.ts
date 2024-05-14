export type Case = Record<
  string,
  string | number | boolean | null | undefined | any
> & {
  ".influence_weight"?: number;
  ".session"?: string;
  ".session_training_index"?: number;
};

export type IdFeaturesProps = {
  /**
   * A list of features which uniquely identify an influence case.
   * These will be used in hover states for influence cases.
   * If not supplied the internal `.session` and `.training_session_index` value will be used.
   **/
  idFeatures?: string[];
};
