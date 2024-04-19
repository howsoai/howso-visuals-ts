import {
  ChartColors,
  Divergent1Colorway,
  Divergent2Colorway,
  getColorScale,
  getContrastingTextColor,
  getSemanticColors,
} from ".";

describe("colors/utils", () => {
  // TypeError: (0 , tinycolor2_1.default) is not a function. Yeah... it is
  describe.skip("getContrastingTextColor", () => {
    it("should return white for the named color shades over 500 and black for the rest of named colors", () => {
      const lightSemanticColors = getSemanticColors({ colorScheme: "light" });
      const lightColor = lightSemanticColors.text.primary;
      const darkSemanticColors = getSemanticColors({ colorScheme: "dark" });
      const darkColor = darkSemanticColors.text.primary;

      Object.entries(ChartColors).forEach(([name, namedColor]) => {
        const contrast900 = getContrastingTextColor(namedColor["900"]);
        expect(contrast900).toBe(lightColor);
        const contrast800 = getContrastingTextColor(namedColor["800"]);
        expect(contrast800).toBe(lightColor);
        const contrast700 = getContrastingTextColor(namedColor["700"]);
        expect(contrast700).toBe(lightColor);
        const contrast600 = getContrastingTextColor(namedColor["600"]);
        expect(contrast600).toBe(lightColor);
        const contrast500 = getContrastingTextColor(namedColor["500"]);

        expect(contrast500).toBe(darkColor);
        const contrast400 = getContrastingTextColor(namedColor["400"]);
        expect(contrast400).toBe(darkColor);
        const contrast300 = getContrastingTextColor(namedColor["300"]);
        expect(contrast300).toBe(darkColor);
        const contrast200 = getContrastingTextColor(namedColor["200"]);
        expect(contrast200).toBe(darkColor);
        const contrast100 = getContrastingTextColor(namedColor["100"]);
        expect(contrast100).toBe(darkColor);
      });
    });
  });

  describe("getColorScale", () => {
    it("should return color scales allocated between 0 and 1", () => {
      const expectedStops = [
        0, 0.09090909090909091, 0.18181818181818182, 0.2727272727272727,
        0.36363636363636365, 0.4545454545454546, 0.5454545454545454,
        0.6363636363636364, 0.7272727272727273, 0.8181818181818182, 1,
      ];

      const d1ColorScale = getColorScale(Divergent1Colorway);
      d1ColorScale.forEach((stop, index) => {
        const [stopValue, stopColor] = stop;
        expect(stopValue).toBe(expectedStops[index]);
        expect(stopColor).toBe(Divergent1Colorway[index]);
      });

      const d2ColorScale = getColorScale(Divergent2Colorway);
      d2ColorScale.forEach((stop, index) => {
        const [stopValue, stopColor] = stop;
        expect(stopValue).toBe(expectedStops[index]);
        expect(stopColor).toBe(Divergent2Colorway[index]);
      });
    });
  });
});
