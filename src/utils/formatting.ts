export const formatCategoryTickText = (string: string): string => {
  const limit = 15;

  if (string.length < limit) {
    return string;
  }
  const regex = new RegExp(`.{1,${limit}}(?:\\s|$)`, "g");
  const chunks = string.match(regex);
  if (!chunks) {
    return "";
  }

  return [chunks.at(0), chunks.at(-1)]
    .map((chunk) => (chunk || "").trim())
    .filter(Boolean)
    .join("<br />");
};
