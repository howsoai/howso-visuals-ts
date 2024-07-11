import { UMAPVisualKNNProps } from "../UMAPVisual";

export const getUMAPKNNParamsFromHowsoTraineeDistances = (
  distances: Record<string, Record<string, number>>
): {
  knnIndices: NonNullable<UMAPVisualKNNProps<unknown>["knnIndices"]>;
  knnDistances: NonNullable<UMAPVisualKNNProps<unknown>["knnDistances"]>;
} => {
  if (!distances) {
    throw new Error("distances is undefined");
  }

  return {
    knnIndices: Object.values(distances).map((vectorObject) =>
      Object.keys(vectorObject).map(Number)
    ),
    knnDistances: Object.values(distances).map((vectorObject) =>
      Object.values(vectorObject)
    ),
  };
};
