export type Case = Record<
  string,
  string | number | boolean | null | undefined | any
> & {
  ".influence_weight"?: number;
  ".session"?: string;
  ".session_training_index"?: number;
};
