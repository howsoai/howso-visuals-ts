import { UMAPVisualKNNProps } from "../UMAPVisual";

/** Returns the indices and distances from a Howso Trainee in asc order */
export const getUMAPKNNParamsFromHowsoTraineeDistances = (
  distances: Record<string, Record<string, number>>
): {
  knnIndices: NonNullable<UMAPVisualKNNProps<unknown>["knnIndices"]>;
  knnDistances: NonNullable<UMAPVisualKNNProps<unknown>["knnDistances"]>;
} => {
  if (!distances) {
    throw new Error("distances is undefined");
  }

  const knnDistances: number[][] = [];
  const knnIndices: number[][] = [];

  Object.values(distances).forEach((distances, fromIndex) => {
    knnDistances.push([]);
    knnIndices.push([]);

    Object.values(distances)
      .map((distance, index) => ({ distance, index }))
      .sort((a, b) => a.distance - b.distance)
      .forEach(({ distance, index }) => {
        knnDistances[fromIndex].push(distance);
        knnIndices[fromIndex].push(index);
      });
  });

  return { knnIndices, knnDistances };
};
