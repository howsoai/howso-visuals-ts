export type Case = Record<string, string | number | null | undefined> & {
  ".influence_weight"?: number;
  ".session"?: string;
  ".session_training_index"?: number;
};
