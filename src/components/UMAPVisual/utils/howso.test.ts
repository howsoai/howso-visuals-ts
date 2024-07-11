import { getUMAPKNNParamsFromHowsoTraineeDistances } from "./howso";

describe("UMAPVisual/utils", () => {
  describe("getUMAPKNNParamsFromHowsoTraineeDistances", () => {
    it("should return parameters for knn initialization", () => {
      const distances = {
        "0": {
          "0": Math.random() * 5,
          "1": Math.random() * 2,
          "2": Math.random() * 12,
        },
        "1": {
          "0": Math.random() * 5,
          "1": Math.random() * 2,
          "2": Math.random() * 12,
        },
      };

      const { knnDistances, knnIndices } =
        getUMAPKNNParamsFromHowsoTraineeDistances(distances);
      expect(knnDistances.length).toBe(2);
      expect(knnDistances[0].length).toBe(3);
      expect(knnIndices.length).toBe(2);
      expect(knnIndices[0].length).toBe(3);
    });
  });
});
