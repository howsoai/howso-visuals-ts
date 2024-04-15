import { Divergent1, getColorScale } from ".";

describe("colors/utils", () => {
  describe("getColorScale", () => {
    it("should return Divergent1 allocated between 0 and 1", () => {
      const colorScale = getColorScale(Divergent1);
      expect(colorScale).toStrictEqual([
        [0, "#ea5f94"],
        [0.09090909090909091, "#ef7fa6"],
        [0.18181818181818182, "#f29db8"],
        [0.2727272727272727, "#f3b9ca"],
        [0.36363636363636365, "#f3d5dd"],
        [0.4545454545454546, "#f1f1f1"],
        [0.5454545454545454, "#d4d2f2"],
        [0.6363636363636364, "#b5b5f3"],
        [0.7272727272727273, "#9299f3"],
        [0.8181818181818182, "#687ef3"],
        [1, "#1c64f2"],
      ]);
    });
  });
});
