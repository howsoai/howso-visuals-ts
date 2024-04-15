import { BaseVisualProps } from "..";

export type FeatureContributionsBaseVisualProps = BaseVisualProps & {
  features: FeatureContributionIndex;
};

/**
 * A record of feature and value as numbers between 0 and 1.
 **/
export type FeatureContributionIndex = Record<string, number>;
