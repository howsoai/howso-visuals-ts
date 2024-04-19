export type FormatCategoryTickTextParams = {
  /**
   * A minimum size limit for chunks. Breaks will be produced after this size at the next word boundary.
   * The first chunk and the last will be concatenated.
   * Default: 15
   **/
  limit?: number;
  /**
   * If true, truncation will include `<br />` elements to force label line wraps between truncation chunks.
   * Default: true
   **/
  wrap?: boolean;
  /** A list of characters to replace with spaces as candidates for truncation breaks */
  replacements?: string | RegExp;
};

export const formatCategoryTickText = (
  string: string,
  params: FormatCategoryTickTextParams = {
    limit: 15,
    wrap: true,
  }
): string => {
  const limit = params.limit || 15;
  const wrap = typeof params.wrap === "boolean" ? params.wrap : true;

  if (string.length < limit) {
    return string;
  }
  const replacedString = params.replacements
    ? string.replaceAll(params.replacements, " ")
    : string;

  const regex = new RegExp(`.{1,${limit}}(?:\\s|$)`, "g");
  const chunks = replacedString.match(regex);
  if (!chunks) {
    return "";
  }

  return [chunks.at(0), chunks.at(-1)]
    .map((chunk) => (chunk || "").trim())
    .filter(Boolean)
    .join(wrap ? "…<br />" : " … ");
};
