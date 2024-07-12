import { irisData, irisDistances } from "@/data";
import { UMAP } from "umap-js";
import { getUMAPKNNParamsFromHowsoTraineeDistances } from "./howso";

describe("UMAP2D/utils", () => {
  describe("getUMAPKNNParamsFromHowsoTraineeDistances", () => {
    it("should return parameters for knn initialization", () => {
      const distances = {
        "0": {
          "0": 0.8,
          "1": 12,
          "2": 5,
        },
        "1": {
          "0": Math.random() * 5,
          "1": 0.8,
          "2": Math.random() * 12,
        },
      };

      const { knnDistances, knnIndices } =
        getUMAPKNNParamsFromHowsoTraineeDistances(distances);
      expect(knnDistances.length).toBe(2);
      expect(knnIndices.length).toBe(2);
      expect(knnDistances[0]).toStrictEqual([0.8, 5, 12]);
      expect(knnIndices[0]).toStrictEqual([0, 2, 1]);
    });

    it("should return UMAP based positions based on iris data", () => {
      const { knnDistances, knnIndices } =
        getUMAPKNNParamsFromHowsoTraineeDistances(irisDistances);

      const umap = new UMAP({ nNeighbors: 21, minDist: 0.4 });
      umap.setPrecomputedKNN(knnIndices, knnDistances);
      // @ts-expect-error We already setup the precomputed details, it's fine to put in raw data
      const positions = umap.fit(irisData);
      expect(positions.length).toBe(irisData.length);
    });
  });
});
