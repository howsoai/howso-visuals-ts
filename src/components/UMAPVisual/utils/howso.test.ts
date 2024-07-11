import { UMAP } from "umap-js";
import { getUMAPKNNParamsFromHowsoTraineeDistances } from "./howso";
import { irisData, irisDistances } from "@/data";

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

  describe("UMAP fit data", () => {
    const { knnDistances, knnIndices } =
      getUMAPKNNParamsFromHowsoTraineeDistances(irisDistances);

    const umap = new UMAP({});

    if (knnIndices?.length && knnDistances?.length) {
      console.info("Setting knnIndices and knnDistances");
      umap.setPrecomputedKNN(knnIndices, knnDistances);
    }

    // @ts-expect-error We're safe to ignore Vector shape as we called setPrecomputedKNN earlier
    const positions = umap.fit(irisData);
    console.info(positions);
    expect(positions).toBeFalsy();
  });
});
