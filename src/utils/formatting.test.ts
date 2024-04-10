import { formatCategoryTickText } from ".";

describe("utils/formatting", () => {
  describe("formatCategoryTickText", () => {
    it("should return a string of less than the limit unaltered", () => {
      const category = "Example A";
      const formatted = formatCategoryTickText(category);
      expect(formatted).toBe(category);
    });

    it("should return a string containing the first and last set of words split by word boundary separated a single <br />", () => {
      const category =
        "Example A, Example B, Example C, Example D, Example E, Example F";
      const formatted = formatCategoryTickText(category);
      expect(formatted).toBe("Example A,...<br />Example F");
    });

    it("should return a string containing the first and last set of words split by | separated a single <br />", () => {
      const category = "condiments sauces and seasonings|condiments";
      const formatted = formatCategoryTickText(category);
      expect(formatted).toBe("condiments...<br />condiments");
    });
  });
});
