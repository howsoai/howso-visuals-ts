import { getUMAPKNNParamsFromHowsoTraineeDistances } from "./howso";

describe("UMAPVisual/utils", () => {
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
  });
});
