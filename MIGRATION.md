# Migration guide

## 2.0.0

- `CausalAnalysisProps` props have changed
  - `metric`
    - 'feature_contributions' -> 'prediction_contributions'
    - 'MDA' -> 'accuracy_contributions'
- `FeatureImportancesProps` have changed
  - `metric`: 'feature_contributions' -> 'prediction_contributions'
    `data`: `feature_contributions_robust` -> `feature_robust_prediction_contributions`
  - `metric`: 'feature_mda' -> 'accuracy_contributions'
    `data`: `feature_mda_robust` -> `feature_robust_accuracy_contributions`
- `FeaturesImportancesCategorizationProps` have changed
  - `data[].scaled_fc` -> `data[].scaled_pc`
  - `data[].scaled_mda` -> `data[].scaled_ac`
  - `data.columns` added and required
  - `data.action_feature` added and required

## 1.x Initial version
